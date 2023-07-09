import { assert } from "chai";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomNumber(from: number, to: number): number {
    return from + Math.floor(Math.random() * to);
}

export function randomString(length: number = 10): string {
    let result = "";

    while (result.length < length) {
        result += CHARACTERS.charAt(randomNumber(0, CHARACTERS.length));
    }

    return result;
}

export async function assertThrowsException(func: Promise<any>, type: any, containsMessage: string | null = null) {
    try {
        await func;
        assert.isFalse(true, "No exception was thrown");
    } catch (e) {
        assert.instanceOf(e, type);
        if (e instanceof Error && containsMessage) {
            assert.isTrue(e.message.includes(containsMessage));
        }
    }
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class TestClock {

    private _now = new Date();

    public setTime(now: Date) {
        this._now = now;
    }

    now(): Date {
        return this._now;
    }

    nowSecondsTimestamp(): number {
        return this.now().getTime() / 1000;
    }

    nowPlusSecondsTimestamp(secondsToAdd: number): number {
        return this.nowSecondsTimestamp() + secondsToAdd;
    }
}