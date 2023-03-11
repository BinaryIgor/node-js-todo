import { Knex } from "knex";
import { Todo } from "../todo";
import { TodoRepository } from "./todo-repository";

export class SqlTodoRepository implements TodoRepository {

    constructor(private readonly db: Knex){}

    create(todo: Todo): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}