import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

// Required fields: will be denormalized and referenced directly by other collections
export const BookSchema: mongoose.Schema = new Schema(
  {
    authors: { type: [String], required: true },
    contents: String,
    datetime: Date,
    isbn: String,
    price: Number,
    publisher: String,
    sale_price: Number,
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    translators: [String],
    url: String
  },
  { versionKey: false }
);

// <Document, {}> are value types that can be provided to model constructor (generics)
const Book: Model<Document, {}> = mongoose.model("Book", BookSchema);
export default Book;
