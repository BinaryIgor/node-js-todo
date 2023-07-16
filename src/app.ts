import express, { Request, Response, NextFunction } from "express";
import { buildRoutes } from "./user/user-routes";
import { asyncHandler, ErrorResponse } from "./common/web";
import { AppError, NotFoundError, UnauthenticatedError } from "./common/errors";
import bodyParser from "body-parser";
import { config } from "./config";
import { postgresDb } from "./common/postgres-db";
import { AuthModule } from "./auth/auth-module";
import { buildTodoRoutes } from "./todo/todo-routes";
import promClient from "prom-client";
import { Clock, defaultClock } from "./common/dates";

function isPublicEndpoint(endpoint: string): boolean {
    return endpoint.startsWith("/users/sign-in") || endpoint.startsWith("/users/sign-up")
        || endpoint.startsWith("/auth/refresh-tokens")
        || endpoint.startsWith("/metrics");
}

//TODO: workaround for tests complaining:
// Error: A metric with the name process_cpu_user_seconds_total has already been registered
let defaultMetricsAreCollected = false;

export const startApp = (config: {
    port: number,
    db: {
        host: string,
        port: number,
        database: string,
        user: string,
        password: string
    },
    jwt: {
        accessTokenDuration: number,
        refreshTokenDuration: number,
        secret: string,
        issuer: string
    }
}, clock: Clock = defaultClock) => {
    const db = postgresDb(config.db);

    const jwtConfig = config.jwt;
    const authModule = new AuthModule({
        clock: clock,
        accessTokenDuration: jwtConfig.accessTokenDuration,
        refreshTokenDuration: jwtConfig.refreshTokenDuration,
        secret: jwtConfig.secret,
        issuer: jwtConfig.issuer,
        isPublicEndpoint: isPublicEndpoint
    });
    const authClient = authModule.client;
    const authMiddleware = authModule.middleware;

    //TODO: shouldn't be public, use express-prometheus-middleware!
    if (!defaultMetricsAreCollected) {
        promClient.collectDefaultMetrics({
            labels: {
                "app": "node-todo"
            }
        });
        defaultMetricsAreCollected = true
    }

    const app = express();

    app.use(bodyParser.json());
    app.use((req: Request, res: Response, next: NextFunction) => authMiddleware.call(req, next));

    app.get("/metrics", asyncHandler(async (req: Request, res: Response) => {
        const metrics = await promClient.register.metrics();
        res.contentType("plain/text");
        res.send(metrics);
    }));

    app.use("/auth", authModule.router);

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
        authClient: authClient
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

