import express, {Application, Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/",  (req: Request, res: Response) => {
    console.log(`Geting request ${req.path}, ${req.query}`);
    res.json({
        id: "some uuid",
        name: "some-name"
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});