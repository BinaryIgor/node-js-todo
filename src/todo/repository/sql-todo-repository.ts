import { Knex } from "knex";
import { Priority, Step, Todo } from "../todo";
import { TodoRepository, TodosQuery } from "./todo-repository";
import { UUID } from "../../common/types";

const TODO_SCHEMA = "todo";
const TODO_TABLE = "todo";
const STEP_TABLE = "step";

interface TodoTable {
    id: UUID,
    user_id: UUID,
    name: string,
    deadline: Date | null,
    priority: Priority,
    description: string | null,
}

interface StepTable {
    todo_id: UUID,
    order: number,
    name: string,
    description: string | null
}

interface TodoStepRow {
    t_id: UUID,
    t_user_id: UUID,
    t_name: string,
    t_deadline: Date | null,
    t_priority: Priority,
    t_description: string | null,
    s_order: number,
    s_name: string,
    s_description: string | null
}

export class SqlTodoRepository implements TodoRepository {

    constructor(private readonly db: Knex) { 
        // this.db.on('start', (builder) => {
        //     // do something with builder.toQuery();
        //     console.log("Query...", builder.toQuery());
        //   });
    }

    async todosOfUser(query: TodosQuery): Promise<Todo[]> {
        const rows = await this.db.select({
            t_id: 't.id',
            t_user_id: 't.user_id',
            t_name: 't.name',
            t_deadline: 't.deadline',
            t_priority: 't.priority',
            t_description: 't.description',
            s_order: 's.order',
            s_name: 's.name',
            s_description: 's.description'
        })
            .withSchema(TODO_SCHEMA)
            .from(`${TODO_TABLE} as t`)
            .leftJoin(`${STEP_TABLE} as s`, 't.id', 's.todo_id')
            .where(builder => {
                builder.where("user_id", query.userId);

                if (query.priorities && query.priorities.length > 0) {
                    builder.and.whereIn("priority", query.priorities);
                }

                if (query.deadlineFrom) {
                    builder.and.where('deadline', '>=', query.deadlineFrom);
                }
                if(query.deadlineTo) {
                    builder.and.where('deadline', '<', query.deadlineTo);
                }
            })
            .orderBy("t.created_at", "s.order") as TodoStepRow[];

        return this.todoStepsRowsToTodos(rows);
    }

    private todoStepsRowsToTodos(rows: TodoStepRow[]): Todo[] {
        const todoIds = new Set<UUID>();
        const todosdWithoutSteps: Todo[] = [];
        const stepsByTodo = new Map<UUID, Step[]>();

        for (let r of rows) {
            let tSteps: Step[];
            if (stepsByTodo.has(r.t_id)) {
                tSteps = stepsByTodo.get(r.t_id) as Step[];
            } else {
                tSteps = [];
                stepsByTodo.set(r.t_id, tSteps);
            }
            tSteps.push(new Step(r.s_order, r.s_name, r.s_description));

            if (!todoIds.has(r.t_id)) {
                todoIds.add(r.t_id);

                todosdWithoutSteps.push(Todo.create({
                    id: r.t_id,
                    userId: r.t_user_id,
                    name: r.t_name,
                    deadline: r.t_deadline,
                    priority: r.t_priority,
                    description: r.t_description,
                    steps: []
                }));
            }
        }

        return todosdWithoutSteps.map(t => {
            const steps = stepsByTodo.get(t.id);
            if (steps) {
                return t.withSteps(steps);
            }
            return t;
        });
    }

    async create(todo: Todo): Promise<void> {
        return this.db.transaction(async trx => {
            await trx<TodoTable>(TODO_TABLE)
                .withSchema(TODO_SCHEMA)
                .insert(this.todoAsTodoTable(todo));

            if (todo.steps) {
                await trx<StepTable>(STEP_TABLE)
                    .withSchema(TODO_SCHEMA)
                    .insert(this.stepsToStepsTable(todo.id, todo.steps));
            }
        });
    }

    private todoAsTodoTable(todo: Todo): TodoTable {
        return {
            id: todo.id,
            user_id: todo.userId,
            name: todo.name,
            deadline: todo.deadline,
            priority: todo.priority,
            description: todo.description,
        }
    }

    private stepsToStepsTable(todoId: UUID, steps: Step[]): StepTable[] {
        return steps.map(s => {
            return {
                todo_id: todoId,
                order: s.order,
                name: s.name,
                description: s.description
            }
        });
    }
}