
export function isDateAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime();
}

export function toSecondsTimestamp(date: Date): number {
    return date.getTime() / 1000;
}

export function dateFromSecondsTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export interface Clock {
    now(): Date
}

export const defaultClock: Clock = {
    now(): Date {
        return new Date();
    }
};