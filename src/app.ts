import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
mongoose.connect("mongodb://localhost/bcha-server");

const app: express.Application = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, (): void => {
  console.log("Listening on port 5000");
});
