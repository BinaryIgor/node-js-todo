import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { CreateTodoHandler } from "./handler/create-todo-handler";
import { Priority, Step, Todo } from "./todo";
import { asyncHandler, requireBody } from "../common/web";
import { SqlTodoRepository } from "./repository/sql-todo-repository";
import { getUserIdOrThrow } from "../auth/web-user-context";
import { newId } from "../common/ids";

export const buildTodoRoutes = (db: Knex) => {
    const todoRepository = new SqlTodoRepository(db);

    const createTodoHandler = new CreateTodoHandler(todoRepository);

    const todoRoutes = Router();

    todoRoutes.post("/", asyncHandler(async (req: Request, res: Response) => {
        const request = requireBody<CreateTodoRequest>(req);

        const todoId = newId();
        const userId = getUserIdOrThrow(req);

        const newTodo = Todo.create({
            id: todoId,
            userId: userId,
            name: request.name,
            deadline: request.deadline,
            priority: request.priority,
            description: request.description,
            steps: request.steps
        });

        const createdTodo = await createTodoHandler.handle(newTodo);

        res.status(201).send(createdTodo);
    }));

    return todoRoutes;
};


class CreateTodoRequest {
    constructor(
        readonly name: string,
        readonly deadline: Date | undefined,
        readonly priority: Priority,
        readonly description: string,
        readonly steps: Step[]) { }
}