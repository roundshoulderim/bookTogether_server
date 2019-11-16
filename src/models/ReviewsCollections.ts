import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const ReviewsCollectionsSchema: mongoose.Schema = new Schema(
  {
    review_id: { type: String, required: true },
    collection_id: { type: String, required: true }
  },
  { versionKey: false }
);

const ReviewsCollections: Model<Document, {}> = mongoose.model(
  "ReviewsCollections",
  ReviewsCollectionsSchema
);
export default ReviewsCollections;
