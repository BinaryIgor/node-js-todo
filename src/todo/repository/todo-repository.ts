import { UUID } from "../../common/types";
import { Priority, Todo } from "../todo";

export class TodosQuery {
    constructor(readonly userId: UUID, 
        readonly priorities: Priority[], 
        readonly deadlineFrom?: Date,
        readonly deadlineTo?: Date) {}
}

export interface TodoRepository {
    
    create(todo: Todo): Promise<void>

    todosOfUser(query: TodosQuery): Promise<Todo[]>
}