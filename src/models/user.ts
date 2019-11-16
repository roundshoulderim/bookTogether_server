import mongoose from "mongoose";
import { BookSchema } from "./Book";
const Schema: any = mongoose.Schema;

// Note that we don't require everything, because signup request only consists of the first four fields
export const UserSchema: mongoose.Schema = new Schema(
  {
    email: { type: String, unique: true },
    image: { type: String, default: null },
    name: { type: String, required: true }, // Name is required wherever UserSchema is referenced
    password: String,
    profile: { type: String, default: "" },
    to_read: [BookSchema],
    reading: [BookSchema],
    finished: [BookSchema],
    numBooksGoal: Number,
    numReviewsGoal: Number
  },
  { versionKey: false }
);

const User: any = mongoose.model("User", UserSchema);
export default User;
