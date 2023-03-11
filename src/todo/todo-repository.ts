import { Todo } from "./todo";

export interface TodoRepository {
    create(todo: Todo): Promise<void>
}