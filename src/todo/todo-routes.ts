import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { CreateTodoHandler } from "./handler/create-todo-handler";
import { Priority, Step, Todo } from "./todo";
import { asyncHandler, requireBody, requireDateTimeInIsoFormat, requireEnum } from "../common/web";
import { SqlTodoRepository } from "./repository/sql-todo-repository";
import { getUserIdOrThrow } from "../auth/web-user-context";
import { newId } from "../common/ids";
import { GetTodosHandler } from "./handler/get-todos-handler";
import { TodosQuery } from "./repository/todo-repository";
import { UUID } from "../common/types";

export const buildTodoRoutes = (db: Knex) => {
    const todoRepository = new SqlTodoRepository(db);

    const createTodoHandler = new CreateTodoHandler(todoRepository);
    const getTodosHandler = new GetTodosHandler(todoRepository);

    const todoRoutes = Router();

    todoRoutes.post("/", asyncHandler(async (req: Request, res: Response) => {
        const request = requireBody<CreateTodoRequest>(req);

        const todoId = newId();
        const userId = getUserIdOrThrow(req);

        const newTodo = todoFromCreateRequest(request, todoId, userId);

        const createdTodo = await createTodoHandler.handle(newTodo);

        res.status(201).send(createdTodo);
    }));

    todoRoutes.get("/", asyncHandler(async (req: Request, res: Response) => {
        const priorities = prioritiesFromQueryParam(req);

        const deadlineFromStr = req.query.deadlineFrom as (string | undefined);
        const deadlineToStr = req.query.deadlineTo as (string | undefined);

        const userId = getUserIdOrThrow(req);

        const todos = await getTodosHandler.handle(
            new TodosQuery(
                userId, priorities,
                optionalDateTime(deadlineFromStr),
                optionalDateTime(deadlineToStr)
            ));

        res.send(todos);
    }));

    return todoRoutes;
};

function prioritiesFromQueryParam(req: Request): Priority[] {
    const priorities = req.query.priority;
    if(!priorities) {
        return [];
    }
    return (priorities as string[]).map(p => p as Priority);
}

function optionalDateTime(dateTime: string | undefined): Date | undefined {
    return dateTime ? requireDateTimeInIsoFormat(dateTime) : undefined;
}

export class CreateTodoRequest {
    constructor(
        readonly name: string,
        readonly deadline: string | null,
        readonly priority: Priority,
        readonly description: string | null,
        readonly steps: Step[]) { }
}

function todoFromCreateRequest(request: CreateTodoRequest, todoId: UUID, userId: UUID): Todo {
    return Todo.create({
        id: todoId,
        userId: userId,
        name: request.name,
        deadline: request.deadline ? requireDateTimeInIsoFormat(request.deadline) : null,
        priority: request.priority,
        description: request.description,
        steps: request.steps
    });
}