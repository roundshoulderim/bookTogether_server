import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema: any = mongoose.Schema;

// Required fields: will be denormalized and referenced directly by other collections
export const BookSchema: mongoose.Schema = new Schema(
  {
    authors: [String],
    contents: String,
    datetime: Date,
    isbn: String,
    price: Number,
    publisher: String,
    sale_price: Number,
    thumbnail: String,
    title: String,
    translators: [String],
    url: String
  },
  { versionKey: false }
);

BookSchema.plugin(mongoosePaginate); // add pagination method

const Book: mongoose.PaginateModel<any> = mongoose.model("Book", BookSchema);
export default Book;
