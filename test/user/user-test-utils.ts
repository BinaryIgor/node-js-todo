import { User } from "../../src/user/models";
import { MAX_PASSWORD_LENGTH } from "../../src/user/user-validator";
import { MAX_NAME_LENGTH } from "../../src/common/validator";
import { newId } from "../../src/common/ids";

export const TestUserObjects = {

    aUser({ id = newId(), name = "User1", password = "complexPassword123" } = {}): User {
        return new User(id, name, password);
    },
    invalidNames(): (string | null | undefined)[] {
        return [
            "A",
            "",
            null,
            undefined,
            "8991",
            "9daad",
            "A" + "B".repeat(MAX_NAME_LENGTH)
        ];
    },
    invalidPasswords(): (string | null | undefined)[] {
        return [
            "",
            null,
            undefined,
            "89919001",
            "SomePasswordNodigits",
            "lowercase99",
            "1a" + "B".repeat(MAX_PASSWORD_LENGTH)
        ];
    },
};