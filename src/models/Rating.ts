import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const RatingSchema: mongoose.Schema = new Schema({
  user_id: { type: String, required: true },
  book_id: { type: String, required: true },
  rating: { type: Number, required: true }
});

const Rating: Model<Document, {}> = mongoose.model("Rating", RatingSchema);
export default Rating;
