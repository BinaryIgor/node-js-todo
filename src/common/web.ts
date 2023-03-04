import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";

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
        const errorName = error.constructor.name;
        return new ErrorResponse([errorName], error.message);
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