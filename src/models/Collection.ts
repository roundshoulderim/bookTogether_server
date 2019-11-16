import mongoose, { Document, Model } from "mongoose";
import { UserSchema } from "./User";
const Schema: any = mongoose.Schema;

export const CollectionSchema: mongoose.Schema = new Schema(
  {
    author: { type: UserSchema, required: true },
    contents: { type: String, required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true }
  },
  { versionKey: false }
);

const Collection: Model<Document, {}> = mongoose.model(
  "Collection",
  CollectionSchema
);
export default Collection;
