import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "./errors";

export class BodyRequiredError extends AppError {
    constructor() {
        super("Body is required")
    }
}

export class ErrorResponse {
    constructor(readonly errors: string[], readonly message: string = "") { }

    static ofSingle(error: string, message: string = ""): ErrorResponse {
        return new ErrorResponse([error], message);
    }

    static ofError(error: Error): ErrorResponse {
        return new ErrorResponse([ErrorResponse.nameOfError(error)], error.message);
    }

    static nameOfError(error: Error): string {
        return error.constructor.name;
    }
}

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res)).catch(next);
}

export function requireBody<T>(req: Request): T {
    const body = req.body;
    if (body) {
        return body as T;
    }
    throw new BodyRequiredError();
}

export function requireDateTimeInIsoFormat(dateTime: string): Date {
    try {
        const parsed = new Date(dateTime);
        if (parsed.toISOString() == dateTime) {
            throw new ValidationError("");
        }
        return parsed;
    } catch(e) {
        throw new ValidationError("Invalid date time format. Required iso, but was: " + dateTime);
    }
}

export function requireEnum<T>(string: string, type: any): T {
    try {
        const castedEnum = string as T;
        if (Object.values(type).includes(castedEnum)) {
            return castedEnum;
        }
        throw new ValidationError("");
    } catch(e) {
        throw new ValidationError("")
    }
}