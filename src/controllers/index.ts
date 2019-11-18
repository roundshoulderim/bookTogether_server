import express from "express";
import authRouter from "./auth";
import bookRouter from "./book";
import curationRouter from "./curation";
import reviewRouter from "./review";
const AppRouter: express.Router = express.Router();

AppRouter.use("/auth", authRouter);
AppRouter.use("/books", bookRouter);
AppRouter.use("/curations", curationRouter);
AppRouter.use("/reviews", reviewRouter);

export default AppRouter;
