import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const ReviewLikesSchema: mongoose.Schema = new Schema({
  user_id: { type: String, required: true },
  review_id: { type: String, required: true }
});

const ReviewLikes: Model<Document, {}> = mongoose.model(
  "ReviewLikes",
  ReviewLikesSchema
);
export default ReviewLikes;
