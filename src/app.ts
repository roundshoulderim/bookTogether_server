import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import AppRouter from "./controllers";

dotenv.config();
mongoose.connect("mongodb://localhost/bcha-server", {
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

app.listen(process.env.PORT, (): void => {
  console.log("Listening on port 5000");
});
