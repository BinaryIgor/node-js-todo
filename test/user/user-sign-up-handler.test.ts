import { assert } from "chai";
import { UserSignUpHandler, UserSignUpCommand } from "../../src/user/handler/user-sign-up-handler";
import { TestUserRepository } from "./user-test-utils";
import { ScryptPasswordHasher } from "../../src/user/password-hasher";
import { TestUserObjects } from "./user-test-utils";
import { UserSignInCommand } from "../../src/user/handler/user-sign-in-handler";
import { InvalidNameError, InvalidPasswordError } from "../../src/user/handler/user-errors";
import { assertThrowsException } from "../test-utils";
import { User } from "../../src/user/user";

let handler: UserSignUpHandler;
let userRepository: TestUserRepository;
let passwordHasher: ScryptPasswordHasher;

describe("UserSignUpHandler tests", () => {
    beforeEach(() => {
        userRepository = new TestUserRepository();
        passwordHasher = new ScryptPasswordHasher();
        handler = new UserSignUpHandler(userRepository, passwordHasher);
    });

    TestUserObjects.invalidNames().forEach(invalidName =>
        it(`should reject sign-up with invalid name: ${invalidName}`, async () => {
            const command = new UserSignUpCommand(invalidName!!, "SomeGoodPassword12");
            assertThrowsException(handler.handle(command), InvalidNameError, invalidName);
        }));

    TestUserObjects.invalidPasswords().forEach(invalidPassword =>
        it(`should reject sign-up with invalid password: ${invalidPassword}`, async () => {
            const command = new UserSignInCommand("SomeName", invalidPassword!!);
            assertThrowsException(handler.handle(command), InvalidPasswordError);
        }));

    it('should allow signing up', async () => {
        const newUser = TestUserObjects.aUser();
        const command = new UserSignInCommand(newUser.name, newUser.password);

        const currentUser = await userRepository.ofName(newUser.name);
        assert.isNull(currentUser);

        await handler.handle(command);

        const actualUser = await userRepository.ofName(newUser.name);
        const expectedUser = new User(actualUser!!.id, newUser.name, await passwordHasher.hash(newUser.password));

        assert.deepEqual(actualUser, expectedUser);
    });
});