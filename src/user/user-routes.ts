import { Router, Request, Response } from "express";
import { InMemoryUserRepository } from "./repository/user-repository";
import { ScryptPasswordHasher } from "./password-hasher";
import { UserSignUpHandler, UserSignUpCommand } from './handler/user-sign-up-handler';
import { asyncHandler, requireBody } from "../common/web";
import { UserSignInCommand, UserSignInHandler } from "./handler/user-sign-in-handler";
import { authClient } from "../auth/auth-api";
import { Knex } from "knex";

export const buildUserRoutes = (db: Knex) => {
    //TODO: use db!
    const userRepository = new InMemoryUserRepository();
    const passwordHasher = new ScryptPasswordHasher();

    const userSignUpHandler = new UserSignUpHandler(userRepository, passwordHasher);
    const userSignInHandler = new UserSignInHandler(userRepository, passwordHasher, authClient);

    const userRoutes = Router();

    userRoutes.post("/sign-up", asyncHandler(async (req: Request, res: Response) => {
        const command = requireBody<UserSignUpCommand>(req);
        await userSignUpHandler.handle(command);
        res.status(201).send({});
    }));

    userRoutes.post("/sign-in", asyncHandler(async (req: Request, res: Response) => {
        const command = requireBody<UserSignInCommand>(req);
        const authToken = await userSignInHandler.handle(command);
        res.send(authToken);
    }));

    return userRoutes;
};