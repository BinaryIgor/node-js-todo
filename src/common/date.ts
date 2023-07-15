
export function isDateAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime();
}

export function toSecondsTimestamp(date: Date): number {
    return date.getTime() / 1000;
}

export function dateFromSecondsTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export function datePlusSeconds(date: Date, seconds: number): Date {
    const newDate = new Date();
    newDate.setTime(date.getTime() + (seconds * 1000));
    return newDate;
}

export interface Clock {
    now(): Date
}

export const defaultClock: Clock = {
    now(): Date {
        return new Date();
    }
};