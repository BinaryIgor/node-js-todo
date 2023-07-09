export class AppError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthenticatedError extends AppError {
    constructor() {
        super("Authentication required");
    }
}

export class InvalidAuthTokenError extends AppError {
    constructor() {
        super("Invalid auth token");
    }
}