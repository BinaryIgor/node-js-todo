import { assert } from "chai";
import * as chai from "chai";
import chaiExclude from "chai-exclude";
import { assertJsonResponse } from "../web-test-utils";
import { appIntTestSuite, appUrl, authClient, httpClient } from "../app-int-test-suite";
import { CreateTodoRequest } from "../../src/todo/todo-routes";
import { TestUserClient } from "../user/test-user-client";
import * as TestTodoObjects from "./test-todo-objects";
import { Priority, Todo } from "../../src/todo/todo";
import * as Dates from "../../src/common/dates";
import { copyObject } from "../../src/common/copy";
import { requireDateTimeInIsoFormat } from "../../src/common/web";

chai.use(chaiExclude);

const TODOS_URL = "/todos";

let userClient: TestUserClient

appIntTestSuite("Todos endpoints tests", () => {
    beforeEach(() => {
        userClient = new TestUserClient(appUrl(), authClient);
    });

    it(`should allow to create todo`, async () => {
        const userId = await userClient.createUser();
        const accessToken = userClient.accessTokenForUser(userId);

        const todo = TestTodoObjects.aTodo(userId);

        const response = await createTodo(accessToken, TestTodoObjects.todoAsCreateTodoRequest(todo));

        assertJsonResponse<Todo>(response, body => {
            assert.deepEqualExcluding(body, todo, 'id');
        }, 201);
    });

    it('should return todos of an user', async () => {
        const { id: user1Id, token: user1Token } = await userClient.createUserWithToken();
        const { id: user2Id, token: user2Token } = await userClient.createUserWithToken();

        const user1EmptyTodos = await getTodos(user1Token);
        const user2EmptyTodos = await getTodos(user2Token);

        assertJsonResponse<Todo[]>(user1EmptyTodos, body => { assert.isEmpty(body) });
        assertJsonResponse<Todo[]>(user2EmptyTodos, body => { assert.isEmpty(body) });

        const user1Todos = [TestTodoObjects.aTodo(user1Id), TestTodoObjects.aTodo(user1Id)];
        const user2Todos = [TestTodoObjects.aTodo(user2Id), TestTodoObjects.aTodo(user2Id)];

        await createTodos(user1Token, user1Todos);
        await createTodos(user2Token, user2Todos);

        const user1TodosResponse = await getTodos(user1Token);
        const user2TodosResponse = await getTodos(user2Token);

        assertTodosResponseEqual(user1TodosResponse, user1Todos);
        assertTodosResponseEqual(user2TodosResponse, user2Todos);
    });

    it('should allow to search todos of an user', async () => {
        const { id: userId, token: userToken } = await userClient.createUserWithToken();

        const now = new Date();
        const deadline1 = Dates.datePlusSeconds(now, 1);
        const deadline2 = Dates.datePlusSeconds(deadline1, 1);
        const deadline3 = Dates.datePlusSeconds(deadline2, 60);

        const userTodos = [
            TestTodoObjects.aTodo(userId, {
                priority: Priority.HIGH
            }),
            TestTodoObjects.aTodo(userId, {
                deadline: deadline1,
                priority: Priority.HIGH
            }),
            TestTodoObjects.aTodo(userId, {
                deadline: deadline2,
                priority: Priority.MEDIUM
            }),
            TestTodoObjects.aTodo(userId, {
                deadline: deadline2,
                priority: Priority.MEDIUM
            }),
            TestTodoObjects.aTodo(userId, {
                deadline: deadline3,
                priority: Priority.HIGH
            }),
            TestTodoObjects.aTodo(userId, {
                priority: Priority.LOW
            })];

        await createTodos(userToken, userTodos);

        const afterDeadline1Todos = userTodos.slice(1, 5);
        const beforeDeadline3Todos = [userTodos[1], userTodos[2], userTodos[3]];
        const betweenDeadline2And3Todos = [userTodos[2], userTodos[3]];
        const lowPriorityTodos = [userTodos[5]];
        const mediumAndHighPriorityTodos = [userTodos[0], userTodos[1], userTodos[4]];
        const highPriorityAferDeadline1Todos = [userTodos[1], userTodos[4]];

        const afterDeadline1TodosResponse = await getTodos(userToken, {
            priorities: null,
            deadlineFrom: deadline1.toISOString(),
            deadlineTo: null
        });

        assertTodosResponseEqual(afterDeadline1TodosResponse, afterDeadline1Todos);
    });
});

function createTodo(accessToken: string, request: CreateTodoRequest) {
    httpClient.accessToken = accessToken;
    return httpClient.executeRequest(TODOS_URL, { method: "POST", body: request })
}

async function createTodos(accessToken: string, todos: Todo[]) {
    for (let t of todos) {
        await createTodo(accessToken, TestTodoObjects.todoAsCreateTodoRequest(t));
    }
}

function getTodos(accessToken: string,
    {
        priorities = [] as string[] | null,
        deadlineFrom = null as string | null,
        deadlineTo = null as string | null
    } = {}) {
    const queryParams: any = {};

    if (priorities) {
        queryParams.priorities = priorities;
    }
    if (deadlineFrom) {
        queryParams.deadlineFrom = deadlineFrom;
    }
    if (deadlineTo) {
        queryParams.deadlineTo = deadlineTo;
    }

    httpClient.accessToken = accessToken;
    return httpClient.executeRequest(TODOS_URL, { query: queryParams });
}

function assertTodosResponseEqual(response: any, expected: Todo[]) {
    assertJsonResponse<Todo[]>(response, body => {
        const toCompareTodos = body.map(t => copyObject(t, {
            deadline: t.deadline ? requireDateTimeInIsoFormat(String(t.deadline)) : null
        }));
        assert.deepEqualExcluding(toCompareTodos, expected, 'id');
    });
}