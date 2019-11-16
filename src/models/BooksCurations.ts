import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const BooksCurationsSchema: mongoose.Schema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    curation: {
      type: Schema.Types.ObjectId,
      ref: "Curation",
      required: true
    }
  },
  { versionKey: false }
);

const BooksCurations: Model<Document, {}> = mongoose.model(
  "BooksCurations",
  BooksCurationsSchema
);
export default BooksCurations;
