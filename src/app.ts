import express, { Request, Response, NextFunction } from "express";
import { buildRoutes } from "./user/user-routes";
import { asyncHandler, ErrorResponse } from "./common/web";
import { AppError, NotFoundError, UnauthenticatedError } from "./common/errors";
import bodyParser from "body-parser";
import { config } from "./config";
import { postgresDb } from "./common/postgres-db";
import * as AuthModule from "./auth/auth-module";
import { buildTodoRoutes } from "./todo/todo-routes";
import promClient from "prom-client";


function isPublicEndpoint(endpoint: string): boolean {
    return endpoint.startsWith("/users/sign-in") || endpoint.startsWith("/users/sign-up")
        || endpoint.startsWith("/metrics");
}

export const startApp = (config: {
    port: number,
    db: {
        host: string,
        port: number,
        database: string,
        user: string,
        password: string
    }
}) => {
    const db = postgresDb(config.db);
    const authClient = AuthModule.authClient();
    const authMiddleware = AuthModule.authMiddleware(isPublicEndpoint, authClient.authenticate);

    //TODO: shouldn't be public, use express-prometheus-middleware!
    promClient.collectDefaultMetrics({
        labels: {
            "app": "node-todo"
        }
    });

    const app = express();

    app.use(bodyParser.json());
    app.use((req: Request, res: Response, next: NextFunction) => authMiddleware.call(req, next));

    app.get("/metrics", asyncHandler(async (req: Request, res: Response) => {
        const metrics = await promClient.register.metrics();
        res.contentType("plain/text");
        res.send(metrics);
    }));

    const userRoutes = buildRoutes(db, authClient);
    const todoRoutes = buildTodoRoutes(db);

    app.use('/users', userRoutes);
    app.use('/todos', todoRoutes);

    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        console.error("Something went wrong...", error);
        //TODO: refactor!
        let status: number;
        let errorRes: ErrorResponse;
        if (error instanceof NotFoundError) {
            status = 404;
            errorRes = ErrorResponse.ofError(error);
        } else if (error instanceof UnauthenticatedError) {
            status = 401;
            errorRes = ErrorResponse.ofError(error);
        } else if (error instanceof TypeError || error instanceof AppError) {
            status = 400;
            errorRes = ErrorResponse.ofError(error);
        } else {
            status = 500;
            errorRes = ErrorResponse.ofSingle("InternalServerError", "Internal server error");
        }
        res.status(status)
            .json(errorRes);
    });

    app.listen(config.port, () => {
        console.log(`Server started on ${config.port}`);
    });

    return {
        app: app,
        authClient : authClient
    }
};

//Start only if called directly from the console
const entryFile = process.argv?.[1];

if (entryFile.endsWith("app.js")) {
    console.log("Starting an app...");
    startApp(config());
} else {
    console.log(`Different file ${entryFile} not starting app!`);
}

