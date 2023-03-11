import { Todo, Priority, Step } from "../todo";
import { TodoRepository } from "../todo-repository";

export class CreateTodoHandler {

    constructor(private readonly todoRepository: TodoRepository) { }


    async handle(command: CreateTodoCommand): Promise<Todo> {
        const todo = this.toValidatedTodo(command);
        
        await this.todoRepository.create(todo)
    
        return todo;
    }

    //TODO: validate
    private toValidatedTodo(command: CreateTodoCommand): Todo {
        throw new Error("Not implemented yet");
    }
}

export class CreateTodoCommand {

}