import Book from "../models/Book";
import { Document } from "mongoose";
import esIndex from "../helpers/middleware/esIndex";

export const migrateBooks = async () => {
  const books = await Book.find({});
  books.forEach((book: Document) => esIndex(book));
};
