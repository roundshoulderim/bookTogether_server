import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const BooksReviewsSchema: mongoose.Schema = new Schema(
  {
    book_id: { type: String, required: true },
    review_id: { type: String, required: true }
  },
  { versionKey: false }
);

const BooksReviews: Model<Document, {}> = mongoose.model(
  "BooksReviews",
  BooksReviewsSchema
);
export default BooksReviews;
