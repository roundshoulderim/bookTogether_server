import express from "express";
import authRouter from "./auth";
import bookRouter from "./book";
import reviewRouter from "./review";
const AppRouter: express.Router = express.Router();

AppRouter.use("/auth", authRouter);
AppRouter.use("/books", bookRouter);
AppRouter.use("/reviews", reviewRouter);

export default AppRouter;
