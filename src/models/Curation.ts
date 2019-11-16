import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const CurationSchema: mongoose.Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: { type: String, required: true },
    published: { type: Boolean, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    title: { type: String, required: true }
  },
  { versionKey: false }
);

const Curation: Model<Document, {}> = mongoose.model(
  "Curation",
  CurationSchema
);
export default Curation;
