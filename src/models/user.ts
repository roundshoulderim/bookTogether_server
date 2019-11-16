import mongoose from "mongoose";
const Schema: any = mongoose.Schema;

// Note that we don't require everything, because signup request only consists of the first four fields
export const UserSchema: mongoose.Schema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    image: { type: String, default: null },
    name: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, default: "" },
    to_read: [{ book: { type: Schema.Types.ObjectId, ref: "Book" } }],
    reading: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        start: Date,
        goal: Date
      }
    ],
    finished: [
      {
        book: { type: Schema.Types.ObjectId, ref: "Book" },
        start: Date,
        end: Date
      }
    ],
    numBooksGoal: { type: Number, default: 10 },
    numReviewsGoal: { type: Number, default: 10 }
  },
  { versionKey: false }
);

const User: any = mongoose.model("User", UserSchema);
export default User;
