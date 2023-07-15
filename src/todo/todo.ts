import { UUID } from "../common/types";

export class Todo {
    constructor(
        readonly id: UUID,
        readonly userId: UUID,
        readonly name: string,
        readonly deadline: Date | null,
        readonly priority: Priority,
        readonly description: string | null,
        readonly steps: Step[]) { }

    static create(todo: {
        id: UUID,
        userId: UUID,
        name: string,
        deadline: Date | null,
        priority: Priority,
        description: string | null,
        steps: Step[]
    }): Todo {
        return new Todo(todo.id, todo.userId, todo.name, todo.deadline, todo.priority, todo.description, todo.steps);
    }

    withSteps(steps: Step[]): Todo {
        return { ...this, steps };
    }
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export class Step {
    constructor(readonly order: number, readonly name: string, readonly description: string | null = null) { }
}