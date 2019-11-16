import mongoose from "mongoose";
import { BookSchema } from "./Book";
const Schema: any = mongoose.Schema;

// Required fields: will be denormalized and referenced directly by other collections
export const UserSchema: mongoose.Schema = new Schema(
  {
    email: { type: String, unique: true }, // Will be checked in auth process
    image: { type: String, default: null },
    name: { type: String, required: true },
    password: String, // Will be checked in auth process
    profile: { type: String, required: true },
    to_read: { type: [BookSchema], default: [] },
    reading: { type: [BookSchema], default: [] },
    finished: { type: [BookSchema], default: [] }
  },
  { versionKey: false }
);

const User: any = mongoose.model("User", UserSchema);
export default User;
