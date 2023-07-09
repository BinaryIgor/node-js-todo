import { InvalidStepNameError, InvalidStepDescriptionError, InvalidTodoDeadlineError, InvalidTodoDescriptionError, InvalidTodoNameError, InvalidTodoPriorityError, InvalidTodoTooManyStepsError, InvalidTodoNotUniqueStepsError } from "./todo-errors";
import * as Validator from "../common/validator";
import * as Dates from "../common/time";
import { Priority, Step, Todo } from "./todo";

export const MAX_DESCRIPTION_LENGTH = 3_000;
export const MAX_STEPS = 10;

export function validateName(name: string) {
    if (!Validator.isNameValid(name)) {
        throw new InvalidTodoNameError(name);
    }
}

export function validateDeadline(deadline: Date | undefined) {
    if (deadline) {
        const now = new Date();
        if (!Dates.isDateAfter(deadline, now)) {
            throw new InvalidTodoDeadlineError();
        }
    }
}

export function validatePriority(priority: Priority | undefined) {
    if (!priority) {
        throw new InvalidTodoPriorityError();
    }

    for (const p of Object.values(Priority)) {
        if (p == priority) {
            return;
        }
    }

    throw new InvalidTodoPriorityError();
}

export function validateDescription(description: string) {
    if (!isDescriptionValid(description)) {
        throw new InvalidTodoDescriptionError(MAX_DESCRIPTION_LENGTH);
    }
}

function isDescriptionValid(description: string): boolean {
    let valid: boolean;
    try {
        valid = description.length <= MAX_DESCRIPTION_LENGTH;
    } catch (e) {
        valid = false;
    }
    return valid;
}

export function validateStepName(name: string) {
    if (!Validator.isNameValid(name)) {
        throw new InvalidStepNameError(name);
    }
}

export function validateStepDescription(description: string) {
    if (!isDescriptionValid(description)) {
        throw new InvalidStepDescriptionError(MAX_DESCRIPTION_LENGTH);
    }
}

export function validateSteps(steps: Step[]) {
    let tooManySteps: boolean;
    try {
        tooManySteps = steps.length > MAX_STEPS;
    } catch (e) {
        tooManySteps = true;
    }
    if (tooManySteps) {
        throw new InvalidTodoTooManyStepsError(MAX_STEPS);   
    }

    const stepNames: string[] = [];

    steps.forEach(s => {
        if (s.name in stepNames) {
            throw new InvalidTodoNotUniqueStepsError();
        }
        stepNames.push(s.name);

        validateStepName(s.name);
        validateDescription(s.description);
    });
}

export function validateTodo(todo: Todo) {
    validateName(todo.name);
    validateDeadline(todo.deadline);
    validatePriority(todo.priority);
    validateDescription(todo.description);
    validateSteps(todo.steps);
}

