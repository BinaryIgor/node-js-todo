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
}

export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export class Step {
    constructor(readonly order: number, readonly name: string, readonly description: string) { }
}