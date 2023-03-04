import { Router, Request, Response } from "express";
import { InMemoryUserRepository } from "./user-repository";
import { SignUpUserHandler, SignUpUserCommand } from './sign-up-user-handler';
import { asyncHandler, requireBody } from "../common/web";

const userRepository = new InMemoryUserRepository();
const signUpUserHandler = new SignUpUserHandler(userRepository);

export const userRoutes = Router();

userRoutes.post("/sign-up", asyncHandler(async (req: Request, res: Response) => {
    const command = requireBody<SignUpUserCommand>(req);
    console.log("Creating user...", command)
    await signUpUserHandler.handle(command);
    res.status(201).send({});
    console.log("User created!")
}));
