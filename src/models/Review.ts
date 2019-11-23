import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema: any = mongoose.Schema;

export const ReviewSchema: mongoose.Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: String,
    published: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    thumbnail: String,
    title: String
  },
  { versionKey: false }
);

ReviewSchema.plugin(mongoosePaginate); // add pagination method

const Review: mongoose.PaginateModel<any> = mongoose.model(
  "Review",
  ReviewSchema
);
export default Review;
