import { UUID } from "../common/types";

export class Todo {
    constructor(
        readonly id: UUID,
        readonly userId: UUID,
        readonly name: string,
        readonly deadline: Date | undefined,
        readonly priority: Priority,
        readonly description: string,
        readonly steps: Step[]) { }

    static create(todo: Todo): Todo {
        return new Todo(todo.id, todo.userId, todo.name, todo.deadline, todo.priority, todo.description, todo.steps);
    }
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export class Step {
    constructor(readonly name: string, readonly description: string) { }
}