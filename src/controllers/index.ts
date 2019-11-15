import express from "express";
import authRouter from "./auth";
const AppRouter: express.Router = express.Router();

AppRouter.use("/auth", authRouter);

export default AppRouter;
