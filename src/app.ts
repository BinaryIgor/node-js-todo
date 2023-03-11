import express, { Request, Response, NextFunction } from "express";
import { buildUserRoutes } from "./user/user-routes";
import { ErrorResponse } from "./common/web";
import { AppError, NotFoundError, UnauthenticatedError } from "./common/errors";
import bodyParser from "body-parser";
import { config } from "./config";
import { postgresDb } from "./common/postgres-db";
import * as AuthModule from "./auth/auth-module";

function isPublicEndpoint(endpoint: string): boolean {
    return endpoint.startsWith("/users/sign-in") || endpoint.startsWith("/users/sign-up");
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

    const userRoutes = buildUserRoutes(db, authClient);

    const app = express();

    app.use(bodyParser.json());
    app.use((req: Request, res: Response, next: NextFunction) => authMiddleware.call(req, next));

    app.get("/", (req: Request, res: Response) => {
        console.log(`Geting request ${req.path}, ${req.query}`);
        res.json({
            id: "some uuid",
            name: "some-name"
        });
        // throw new Error("Some error!")
    });

    app.use('/users', userRoutes);

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

    return app;
};

//Start only if called directly from the console
const entryFile = process.argv?.[1];

if (entryFile.startsWith("app")) {
    console.log("Starting an app...");
    startApp(config());
}

