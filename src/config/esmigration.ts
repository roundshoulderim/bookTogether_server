import { Model, Document } from "mongoose";
import esIndex from "../helpers/middleware/esIndex";

const mongoToES = async (model: Model<Document, {}>) => {
  const docs = await model.find({});
  docs.forEach((doc: Document) => esIndex(doc));
};

export default mongoToES;
