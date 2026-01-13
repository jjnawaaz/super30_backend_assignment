import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user", userRouter);

app.get("/health", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server started");
});
