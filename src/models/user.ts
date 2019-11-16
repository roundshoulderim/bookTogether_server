import mongoose from "mongoose";
const Schema: any = mongoose.Schema;

const UserSchema: mongoose.Schema = new Schema({
  email: { type: String, required: true }, // email must be unique
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const User: any = mongoose.model("user", UserSchema);
export default User;
