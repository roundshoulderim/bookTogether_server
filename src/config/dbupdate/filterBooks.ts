import Book from "../../models/Book";
import mongoose, { Document } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

interface IBook extends Document {
  title: string;
  authors: string[];
}

// Separate code for updating book collection that isn't properly filtered
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    const allBooks: IBook[] = await Book.find({});
    const avoidWords = [
      "찬송가",
      "성경",
      "세트",
      "샘플",
      "컬러링북",
      "ebook",
      "epub",
      "sample"
    ];
    for (const book of allBooks) {
      if (avoidWords.some(word => book.title.toLowerCase().includes(word))) {
        await Book.findByIdAndDelete(book.id);
      } else {
        const { title, authors } = book;
        const identicalBooks: IBook[] = await Book.find({ title, authors });
        if (identicalBooks.length > 1) {
          // await needed b/c books might be deleted simultaneously if operation is async
          await Book.findByIdAndDelete(book.id);
        }
      }
    }
    console.log("All books in DB filtered according to guidelines.");
  })
  .catch(err => console.log(err.message));
