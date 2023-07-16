import { Todo  } from "../todo";
import { TodoRepository, TodosQuery } from "../repository/todo-repository";

export class GetTodosHandler {
    constructor(private readonly todoRepository: TodoRepository) { }

    async handle(query: TodosQuery): Promise<Todo[]> {
        //TODO verify query
        return this.todoRepository.todosOfUser(query);
    }
}