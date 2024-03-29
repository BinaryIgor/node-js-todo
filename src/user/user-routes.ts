import { Router, Request, Response } from "express";
import { SqlUserRepository } from "./repository/sql-user-repository";
import { ScryptPasswordHasher } from "./password-hasher";
import { UserSignUpHandler, UserSignUpCommand } from './handler/user-sign-up-handler';
import { asyncHandler, requireBody } from "../common/web";
import { UserSignInCommand, UserSignInHandler } from "./handler/user-sign-in-handler";
import { AuthClient } from "../auth/auth-api";
import { Knex } from "knex";

export const buildRoutes = (db: Knex, authClient: AuthClient) => {
    const userRepository = new SqlUserRepository(db);
    const passwordHasher = new ScryptPasswordHasher();

    const userSignUpHandler = new UserSignUpHandler(userRepository, passwordHasher);
    const userSignInHandler = new UserSignInHandler(userRepository, passwordHasher, authClient);

    const userRoutes = Router();

    userRoutes.post("/sign-up", asyncHandler(async (req: Request, res: Response) => {
        const command = requireBody<UserSignUpCommand>(req);
        const userId = await userSignUpHandler.handle(command);
        res.status(201).send({ id: userId });
    }));

    userRoutes.post("/sign-in", asyncHandler(async (req: Request, res: Response) => {
        const command = requireBody<UserSignInCommand>(req);
        const response = await userSignInHandler.handle(command);
        res.send(response);
    }));

    return userRoutes;
};