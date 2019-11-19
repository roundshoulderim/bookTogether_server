import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import AppRouter from "./controllers";

dotenv.config();

const dbUrl: string =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URL
    : process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app: express.Application = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET, // Secret that protects the session
    resave: false, // Do not resave sessions, unless they are changed
    saveUninitialized: false // no uninitialized sessions (if no change from default)
  })
);
app.use(passport.initialize()); // passport를 app의 미들웨어로 설정
app.use(AppRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, (): void => {
    console.log("Listening on port 5000");
  });
}

export default app; // for testing
