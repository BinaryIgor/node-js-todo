import { assert } from "chai";
import { InvalidNameError, InvalidPasswordError } from "../../src/user/user-errors";
import { UserSignInCommand } from "../../src/user/handler/user-sign-in-handler";
import { UserSignUpCommand } from "../../src/user/handler/user-sign-up-handler";
import { assertNotFoundErrorResponse, assertValidationErrorResponse } from "../web-test-utils";
import { appIntTestSuite, appRequest } from "../app-int-test-suite";

appIntTestSuite("Users endpoints tests", () => {
    it('should not allow to create invalid user account', async () => {
        const invalidSignUpCommand = new UserSignUpCommand("", "xD");

        const response = await userSignUpRequest(invalidSignUpCommand);

        assertValidationErrorResponse(response, InvalidNameError);
    });

    it('should not allow to sign-in given invalid request', async () => {
        const invalidSignInCommand = { name: "some name" };

        const response = await userSignInRequest(invalidSignInCommand);

        assertValidationErrorResponse(response, InvalidPasswordError);
    });

    it('should not allow to sign-in given non existing user', async () => {
        const nonExistingUserCommand = new UserSignInCommand("Some user", "ComplexPassword11");

        const response = await userSignInRequest(nonExistingUserCommand);

        assertNotFoundErrorResponse(response);
    });

    it('should allow to create new account and then sign-in', async () => {
        const signUpCommand = new UserSignUpCommand("Iprogrammerr", "SomeComplexPassword123");

        await userSignUpRequest(signUpCommand).expect(201);

        const signInCommand = new UserSignInCommand(signUpCommand.name, signUpCommand.password);

        const signInResponse = await userSignInRequest(signInCommand);

        assert.equal(signInResponse.statusCode, 200);
        assert.isNotEmpty(signInResponse.body.token);
    });
});

function userSignUpRequest(command: UserSignInCommand) {
    return appRequest().post("/users/sign-up").send(command);
}

function userSignInRequest(command: any) {
    return appRequest().post("/users/sign-in").send(command);
}