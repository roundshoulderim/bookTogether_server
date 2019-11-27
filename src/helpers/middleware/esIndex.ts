import { Document } from "mongoose";
import client from "../../config/elasticsearch";

interface IBook extends Document {
  authors: string[];
  contents: string;
  thumbnail: string;
  title: string;
}

export function esIndexBook(book: Document): Promise<any> {
  const { authors, contents, thumbnail, title } = book as IBook;
  return client
    .index({
      index: "books",
      id: book.id,
      refresh: "true",
      body: { authors, contents, thumbnail, title }
    })
    .catch(error => console.log(error));
}
