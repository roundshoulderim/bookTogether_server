import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const BooksReviewsSchema: mongoose.Schema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true }
  },
  { versionKey: false }
);

const BooksReviews: Model<Document, {}> = mongoose.model(
  "BooksReviews",
  BooksReviewsSchema
);
export default BooksReviews;
