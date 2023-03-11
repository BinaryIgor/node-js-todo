import { ValidationError } from "../common/errors";
import { Priority } from "./todo";

export class InvalidTodoNameError extends ValidationError {
    constructor(name: string) {
        super(`${name} is not a valid name`);
    }
}

export class InvalidTodoDeadlineError extends ValidationError {
    constructor() {
        super("Todo deadline must be undefined or be after now");
    }
}

export class InvalidTodoPriorityError extends ValidationError {
    constructor() {
        super(`Invalid Priority values. It must be one of the: ${Object.values(Priority)} values`);
    }
}

export class InvalidTodoDescriptionError extends ValidationError {
    constructor(maxLength: number) {
        super(`Invalid Todo description value. It must have max length of ${maxLength}, but was more`);
    }
}

export class InvalidStepNameError extends ValidationError {
    constructor(name: string) {
        super(`${name} is not a valid name`);
    }
}

export class InvalidStepDescriptionError extends ValidationError {
    constructor(maxLength: number) {
        super(`Invalid Step description value. It must have max length of ${maxLength}, but was more`);
    }
}

export class InvalidTodoTooManyStepsError extends ValidationError {
    constructor(maxSteps: number) {
        super(`TODO has too many steps, max available are: ${maxSteps}`);
    }
}

export class InvalidTodoNotUniqueStepsError extends ValidationError {
    constructor() {
        super("Steps of TODO need to be unique, but weren't");
    }
}