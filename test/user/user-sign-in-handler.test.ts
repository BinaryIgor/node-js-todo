import { assert } from "chai";
import { UserSignInHandler, UserSignInCommand } from "../../src/user/handler/user-sign-in-handler";
import { UserSignUpHandler, UserSignUpCommand } from "../../src/user/handler/user-sign-up-handler";
import { TestUserRepository, TestPasswordHasher, TestAuthClient } from "./user-test-utils";
import { TestUserObjects } from "./user-test-utils";
import { InvalidNameError, InvalidPasswordError, IncorrectUserPasswordError } from "../../src/user/user-errors";
import { assertThrowsException } from "../test-utils";
import { User } from "../../src/user/user";
import { NotFoundError } from "../../src/common/errors";

let handler: UserSignInHandler;
let userRepository: TestUserRepository;
let passwordHasher: TestPasswordHasher;
let authClient: TestAuthClient;
let signUpHandler: UserSignUpHandler;

describe("UserSignInHandler tests", () => {
    beforeEach(() => {
        userRepository = new TestUserRepository();
        passwordHasher = new TestPasswordHasher();
        authClient = new TestAuthClient();
        handler = new UserSignInHandler(userRepository, passwordHasher, authClient);

        signUpHandler = new UserSignUpHandler(userRepository, passwordHasher);
    });

    TestUserObjects.invalidNames().forEach(invalidName =>
        it(`should reject sign in with invalid name: ${invalidName}`, async () => {
            const command = new UserSignInCommand(invalidName!!, "SomeGoodPassword44");
            assertThrowsException(handler.handle(command), InvalidNameError, invalidName);
        }));

    TestUserObjects.invalidPasswords().forEach(invalidPassword =>
        it(`should reject sign in with invalid password: ${invalidPassword}`, async () => {
            const command = new UserSignInCommand("SomeNameOfUser", invalidPassword!!);
            assertThrowsException(handler.handle(command), InvalidPasswordError);
        }));

    it('should reject sign in for non-existing user', async () => {
        const command = new UserSignInCommand("User22", "ComplexPassword22");

        assertThrowsException(handler.handle(command), NotFoundError, `${command.name} name`);
    });


    it('should reject sign in with incorrect user password', async () => {
        const user = TestUserObjects.aUser();

        await signUpHandler.handle(new UserSignUpCommand(user.name, user.password));

        const correctUserPassword = (await userRepository.ofName(user.name))!!.password;
        const incorrectUserPassword = `x_${correctUserPassword}`;

        const command = new UserSignInCommand(user.name, incorrectUserPassword);

        assertThrowsException(handler.handle(command), IncorrectUserPasswordError);
    });

    it('should allow to sign in returning token', async () => {
        const user = TestUserObjects.aUser();

        await signUpHandler.handle(new UserSignUpCommand(user.name, user.password));

        const authToken = await handler.handle(new UserSignInCommand(user.name, user.password));

        assert.deepEqual(authToken, authClient.ofUser(user.name));
    });
});