import { Todo  } from "../todo";
import { TodoRepository } from "../repository/todo-repository";
import * as TodoValidator from "../todo-validator";

export class CreateTodoHandler {

    constructor(private readonly todoRepository: TodoRepository) { }

    async handle(command: Todo): Promise<Todo> {
        TodoValidator.validateTodo(command);
        
        await this.todoRepository.create(command);
    
        return command;
    }
}