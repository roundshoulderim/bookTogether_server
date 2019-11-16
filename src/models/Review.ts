import mongoose, { Document, Model } from "mongoose";
import { UserSchema } from "./User";
const Schema: any = mongoose.Schema;

export const ReviewSchema: mongoose.Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: String,
    published: Boolean,
    thumbnail: String,
    title: String
  },
  { versionKey: false }
);

const Review: Model<Document, {}> = mongoose.model("Review", ReviewSchema);
export default Review;
