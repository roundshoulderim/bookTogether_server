import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const BooksCollectionsSchema: mongoose.Schema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    collection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true
    }
  },
  { versionKey: false }
);

const BooksCollections: Model<Document, {}> = mongoose.model(
  "BooksCollections",
  BooksCollectionsSchema
);
export default BooksCollections;
