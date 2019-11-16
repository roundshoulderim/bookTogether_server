import express from "express";
import authRouter from "./auth";
import reviewRouter from "./review";
const AppRouter: express.Router = express.Router();

AppRouter.use("/auth", authRouter);
AppRouter.use("/reviews", reviewRouter);

export default AppRouter;
