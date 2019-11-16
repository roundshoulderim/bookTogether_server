import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const CollectionLikesSchema: mongoose.Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    collection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true
    }
  },
  { versionKey: false }
);

const CollectionLikes: Model<Document, {}> = mongoose.model(
  "CollectionLikes",
  CollectionLikesSchema
);
export default CollectionLikes;
