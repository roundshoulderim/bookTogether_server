import mongoose, { Document, Model } from "mongoose";
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

ReviewSchema.method("toClient", function(): object {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

const Review: Model<Document, {}> = mongoose.model("Review", ReviewSchema);
export default Review;
