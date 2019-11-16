import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const ReviewLikesSchema: mongoose.Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true }
  },
  { versionKey: false }
);

const ReviewLikes: Model<Document, {}> = mongoose.model(
  "ReviewLikes",
  ReviewLikesSchema
);
export default ReviewLikes;
