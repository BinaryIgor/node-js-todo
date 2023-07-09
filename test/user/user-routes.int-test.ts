import { assert } from "chai";
import { InvalidUserNameError, InvalidPasswordError } from "../../src/user/user-errors";
import { UserSignInCommand, UserSignInResponse } from "../../src/user/handler/user-sign-in-handler";
import { UserSignUpCommand } from "../../src/user/handler/user-sign-up-handler";
import { assertJsonResponse, assertNotFoundErrorResponse, assertValidationErrorResponse } from "../web-test-utils";
import { appIntTestSuite, appRequest, authClient } from "../app-int-test-suite";
import { TestUserObjects } from "./user-test-utils";

appIntTestSuite("Users endpoints tests", () => {
    TestUserObjects.invalidNames().forEach(invalidName =>
        it(`should reject sign-up with invalid name: ${invalidName}`, async () => {
            const command = new UserSignUpCommand(invalidName!!, "SomeGoodPassword12");

            const response = await userSignUpRequest(command);

            assertValidationErrorResponse(response, InvalidUserNameError);
        }));

    TestUserObjects.invalidPasswords().forEach(async invalidPassword =>
        it(`should reject sign-up with invalid password: ${invalidPassword}`, async () => {
            const command = new UserSignUpCommand("SomeName", invalidPassword!!);

            const response = await userSignUpRequest(command);

            assertValidationErrorResponse(response, InvalidPasswordError);
        }));

    it('should allow to create new account and then sign-in', async () => {
        const signUpCommand = new UserSignUpCommand("Iprogrammerr", "SomeComplexPassword123");

        await userSignUpRequest(signUpCommand).expect(201);

        const signInCommand = new UserSignInCommand(signUpCommand.name, signUpCommand.password);

        const signInResponse = await userSignInRequest(signInCommand);

        assertJsonResponse<UserSignInResponse>(signInResponse, body => {
            const userTokenContext = authClient.authenticate(body.tokens.access.token);
            assert.equal(body.userId, userTokenContext.id);
        });
    });

    it('should not allow to sign-in given non existing user', async () => {
        const nonExistingUserCommand = new UserSignInCommand("Some user", "ComplexPassword11");

        const response = await userSignInRequest(nonExistingUserCommand);

        assertNotFoundErrorResponse(response);
    });
});

function userSignUpRequest(command: UserSignInCommand) {
    return appRequest().post("/users/sign-up").send(command);
}

function userSignInRequest(command: any) {
    return appRequest().post("/users/sign-in").send(command);
}