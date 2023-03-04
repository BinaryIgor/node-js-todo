import express, { Application, Request, Response, NextFunction } from "express";
import { userRoutes } from "./user/user-routes";
import { ErrorResponse } from "./common/web";
import { AppError, NotFoundError } from "./common/errors";
import bodyParser from "body-parser";


export const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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
    //TODO: custom errors
    let status: number;
    let errorRes: ErrorResponse;
    if (error instanceof NotFoundError) {
        status = 404;
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

// app.use(async (error: any, req: Request, res: Response) => {
//     console.error("Something went wrong...", typeof error);
//     console.error("Something went wrong...", typeof req);
//     console.error("Something went wrong...", typeof res);
//     console.log(res);
//     res.status(500)
//         .json({
//             errors: ["UNKNOWN_ERROR"]
//         });
// });

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

