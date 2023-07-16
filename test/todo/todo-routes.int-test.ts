import { assert } from "chai";
import * as chai from "chai";
import chaiExclude from "chai-exclude";
import { assertJsonResponse } from "../web-test-utils";
import { appIntTestSuite, appRequest, appUrl, authClient, httpClient } from "../app-int-test-suite";
import { CreateTodoRequest } from "../../src/todo/todo-routes";
import { TestUserClient } from "../user/test-user-client";
import * as TestTodoObjects from "./test-todo-objects";
import { Todo } from "../../src/todo/todo";

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

        const response = await createTodoRequest(accessToken, TestTodoObjects.todoAsCreateTodoRequest(todo));

        assertJsonResponse<Todo>(response, body => {
            assert.deepEqualExcluding(body, todo, 'id');
        }, 201);
    });

    it(`should allow to search user todos`, async () => {
        const user1Id = await userClient.createUser();
        const user2Id = await userClient.createUser();
    });
});

function createTodoRequest(accessToken: string, request: CreateTodoRequest) {
    httpClient.accessToken = accessToken;
    return httpClient.executeRequest(TODOS_URL, { method: "POST", body: request })
}

function getTodosRequest(accessToken: String,
    priorities: string[],
    deadlineFrom?: string,
    deadlineTo?: string) {
    const query: any = {};

    if (priorities) {
        query.priorities = priorities;
    }
    if (deadlineFrom) {
        query.deadlineFrom = deadlineFrom;
    }
    if (deadlineTo) {
        query.deadlineTo = deadlineTo;
    }

    return appRequest()
        .get(TODOS_URL)
        .query(query)
        .set("Authorization", `Bearer ${accessToken}`);

}