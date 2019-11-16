import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const RatingSchema: mongoose.Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, required: true }
  },
  { versionKey: false }
);

const Rating: Model<Document, {}> = mongoose.model("Rating", RatingSchema);
export default Rating;
