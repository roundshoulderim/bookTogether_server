import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const ReviewsCollectionsSchema: mongoose.Schema = new Schema(
  {
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    collection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true
    }
  },
  { versionKey: false }
);

const ReviewsCollections: Model<Document, {}> = mongoose.model(
  "ReviewsCollections",
  ReviewsCollectionsSchema
);
export default ReviewsCollections;
