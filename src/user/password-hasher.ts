import crypto, { BinaryLike } from "crypto";
import { promisify } from "util";

const randomBytesAsync = promisify(crypto.randomBytes);
const scryptAsync = promisify(crypto.scrypt);

export interface PasswordHasher {

    hash(password: string): Promise<string>

    verify(rawPassword: string, hashedPassword: string): Promise<boolean>
}

export class ScryptPasswordHasher implements PasswordHasher {

    constructor(readonly saltLength: number = 16, readonly hashLength: number = 32) { }

    async hash(password: string): Promise<string> {
        const salt = this.bytesToHexString(await randomBytesAsync(this.saltLength));
        const hash = this.bytesToHexString(await this.scryptHash(password, salt));

        return `${salt}:${hash}`;
    }

    private bytesToHexString(bytes: Buffer) {
        return bytes.toString("hex");
    }

    private async scryptHash(password: string, salt: BinaryLike): Promise<Buffer> {
        return (await scryptAsync(password, salt, this.hashLength)) as Buffer;
    }

    async verify(rawPassword: string, hashedPassword: string): Promise<boolean> {
        const [salt, hash] = hashedPassword.split(":");

        const hashBytes = Buffer.from(hash, "hex");
        const derivedHash = await this.scryptHash(rawPassword, salt);

        return crypto.timingSafeEqual(hashBytes, derivedHash);
    }

}