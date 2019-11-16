import mongoose from "mongoose";
const Schema: any = mongoose.Schema;

export const UserSchema: mongoose.Schema = new Schema(
  {
    email: { type: String, unique: true },
    image: { type: String, default: null },
    name: String,
    password: String,
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

UserSchema.method("toClient", function(): object {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

const User: any = mongoose.model("User", UserSchema);
export default User;
