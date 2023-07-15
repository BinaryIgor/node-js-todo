import { expect } from "chai";
// import request from "supertest";
// import app from "../src/index";
import { User } from "../src/user/models";

describe("Makes basic requests", () => {
    // it('should respond with 200 status', () => {
    //     request(app)
    //         .get("/")
    //         .expect(200);
    // })
    it("should pass", () => {
        console.log("Some simple test...")
    });

    it('Users should be equal', () => {
        const firstUser = new User("1", "Igor", "secret password");
        const secondUser = new User("1", "Igor", "secret password");

        expect(firstUser).to.be.deep.eq(secondUser);
    });

    it('should manipulate process env', () => {
        process.env.SOME_VAR = '23';
        const someVar = process.env.SOME_VAR;
        console.log("Some var...", someVar);
    });
})