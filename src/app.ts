import express, {Application, Request, Response } from "express";
import { InMemoryUserRepository } from "./user/user-repository";
import { SignUpUserHandler, SignUpUserCommand } from './user/sign-up-user-handler';

const userRepository = new InMemoryUserRepository();
const signUpUserHandler = new SignUpUserHandler(userRepository);

export const app = express();
const port = process.env.PORT || 3000;

app.get("/",  (req: Request, res: Response) => {
    console.log(`Geting request ${req.path}, ${req.query}`);
    res.json({
        id: "some uuid",
        name: "some-name"
    });
});

app.post("/users/sign-up", async (req: Request, res: Response) => {
    const command = req.body as SignUpUserCommand;
    await signUpUserHandler.handle(command);
    res.status(201).send({});
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});