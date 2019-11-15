import mongoose from "mongoose";
const Schema: any = mongoose.Schema;

const UserSchema: mongoose.Schema = new Schema({
  email: String, // email must be unique
  name: String,
  password: String
});

const User: any = mongoose.model("user", UserSchema);
export default User;
