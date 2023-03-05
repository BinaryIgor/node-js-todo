import { assert } from "chai";
import { ScryptPasswordHasher } from "../../src/user/password-hasher";

const hasher = new ScryptPasswordHasher();

describe("ScryptPasswordHasher tests", () => {
    it('should allow to hash and verify passwords', async () => {
        const password1 = "SomePassword1";
        const password2 = "SomeAnotherPassword22";

        const password1Hash = await hasher.hash(password1);
        const password2Hash = await hasher.hash(password2);

        assert.notEqual(password1Hash, password2Hash);

        const password1To1Comparison = await hasher.verify(password1, password1Hash);
        const password2To2Comparison = await hasher.verify(password2, password2Hash);

        const password1To2Comparison = await hasher.verify(password1, password2Hash);
        const password2To1Comparison = await hasher.verify(password2, password1Hash);

        assert.isTrue(password1To1Comparison);
        assert.isTrue(password2To2Comparison);

        assert.isFalse(password1To2Comparison);
        assert.isFalse(password2To1Comparison);
    });

    it('should hash password with different salt each time', async () => {
        const password = "password999_x^^&";

        const hash1 = await hasher.hash(password);
        const hash2 = await hasher.hash(password);

        assert.notEqual(hash1, hash2);
    });
});
