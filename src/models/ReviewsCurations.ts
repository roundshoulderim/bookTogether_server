import mongoose, { Document, Model } from "mongoose";
const Schema: any = mongoose.Schema;

export const ReviewsCurationsSchema: mongoose.Schema = new Schema(
  {
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    curation: {
      type: Schema.Types.ObjectId,
      ref: "Curation",
      required: true
    }
  },
  { versionKey: false }
);

const ReviewsCurations: Model<Document, {}> = mongoose.model(
  "ReviewsCurations",
  ReviewsCurationsSchema
);
export default ReviewsCurations;
