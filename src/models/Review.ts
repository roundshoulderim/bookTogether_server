import mongoose, { Document, Model } from "mongoose";
import { UserSchema } from "./User";
const Schema: any = mongoose.Schema;

export const ReviewSchema: mongoose.Schema = new Schema({
  author: { type: UserSchema, required: true },
  contents: { type: String, required: true },
  published: { type: Boolean, required: true },
  thumbnail: { type: String, default: null },
  title: { type: String, required: true }
});

const Review: Model<Document, {}> = mongoose.model("Review", ReviewSchema);
export default Review;
