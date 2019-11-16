import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const BooksCollectionsSchema: mongoose.Schema = new Schema(
  {
    book_id: { type: String, required: true },
    collection_id: { type: String, required: true }
  },
  { versionKey: false }
);

const BooksCollections: Model<Document, {}> = mongoose.model(
  "BooksCollections",
  BooksCollectionsSchema
);
export default BooksCollections;
