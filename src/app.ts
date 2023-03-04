import express, { Application, Request, Response, NextFunction } from "express";
import { InMemoryUserRepository } from "./user/user-repository";
import { SignUpUserHandler, SignUpUserCommand } from './user/sign-up-user-handler';

const userRepository = new InMemoryUserRepository();
const signUpUserHandler = new SignUpUserHandler(userRepository);

export const app = express();
const port = process.env.PORT || 3000;

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res)).catch(next);
}

app.get("/", (req: Request, res: Response) => {
    console.log(`Geting request ${req.path}, ${req.query}`);
    res.json({
        id: "some uuid",
        name: "some-name"
    });
    // throw new Error("Some error!")
});

app.post("/users/sign-up", asyncHandler(async (req: Request, res: Response) => {
    const command = req.body as SignUpUserCommand;
    console.log("Creating user...", command)
    await signUpUserHandler.handle(command);
    res.status(201).send({});
    console.log("User created!")
}));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Something went wrong1...", typeof error);
    console.error(error);
    console.error("Something went wrong2...", typeof req);
    console.error("Something went wrong3...", typeof res);
    res.status(500)
        .json({
            errors: ["UNKNOWN_ERROR"]
        });
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

