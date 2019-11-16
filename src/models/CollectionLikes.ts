import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const CollectionLikesSchema: mongoose.Schema = new Schema({
  user_id: { type: String, required: true },
  collection_id: { type: String, required: true }
});

const CollectionLikes: Model<Document, {}> = mongoose.model(
  "CollectionLikes",
  CollectionLikesSchema
);
export default CollectionLikes;
