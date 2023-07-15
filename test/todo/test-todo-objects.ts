import { newId } from "../../src/common/ids";
import { UUID } from "../../src/common/types";
import { Todo, Step, Priority } from "../../src/todo/todo";
import { CreateTodoRequest } from "../../src/todo/todo-routes";
import { randomNumber, randomString } from "../test-utils";

export function aStep({ order = randomNumber(1, 100),
    name = `step-${randomString()}`,
    description = undefined } = {}): Step {
    return new Step(order, name, description);
}

export function aTodo(userId: UUID,
    { id = newId(), name = `todo-${randomString()}`,
        deadline = null,
        priority = Priority.MEDIUM,
        description = null,
        steps = [aStep()] } = {}): Todo {
    return new Todo(id, userId, name, deadline, priority, description, steps);
}

export function todoAsCreateTodoRequest(todo: Todo): CreateTodoRequest {
    return new CreateTodoRequest(todo.name, todo.deadline, todo.priority, todo.description, todo.steps);
}