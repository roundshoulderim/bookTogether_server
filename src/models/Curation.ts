import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const CurationSchema: mongoose.Schema = new Schema(
  {
    author: Schema.Types.ObjectId,
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: String,
    published: Boolean,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    title: String
  },
  { versionKey: false }
);

CurationSchema.method("toClient", function(): object {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

const Curation: Model<Document, {}> = mongoose.model(
  "Curation",
  CurationSchema
);
export default Curation;
