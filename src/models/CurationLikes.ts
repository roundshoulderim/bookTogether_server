import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const CurationLikesSchema: mongoose.Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    curation: {
      type: Schema.Types.ObjectId,
      ref: "Curation",
      required: true
    }
  },
  { versionKey: false }
);

const CurationLikes: Model<Document, {}> = mongoose.model(
  "CurationLikes",
  CurationLikesSchema
);
export default CurationLikes;
