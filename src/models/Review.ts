import mongoose, { Document, Model } from "mongoose";
import { UserSchema } from "./User";
const Schema: any = mongoose.Schema;

export const ReviewSchema: mongoose.Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: { type: String, required: true },
    published: { type: Boolean, required: true },
    thumbnail: { type: String, default: null },
    title: { type: String, required: true }
  },
  { versionKey: false }
);

const Review: Model<Document, {}> = mongoose.model("Review", ReviewSchema);
export default Review;
