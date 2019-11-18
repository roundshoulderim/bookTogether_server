import { Document } from "mongoose";
import Book from "../models/Book";
import Curation from "../models/Curation";
import Review from "../models/Review";

interface IQuery {
  curation_id: string;
  review_id: string;
}

interface ISearchQuery {
  query: string;
  size: number;
  page: number;
}

const bookService = {
  getBooks: async (query: IQuery) => {
    let books: Document[];
    const { curation_id, review_id } = query;
    // Update books array each time to take the intersection of all queries
    function updateBooks(bookArr: Document[]): void {
      if (!books) {
        books = bookArr;
      } else {
        books = books.filter((a: Document) => {
          return bookArr.some((b: Document) => b.id === a.id);
        });
      }
    }

    if (review_id) {
      const review: any = await Review.findById(review_id).populate("books");
      updateBooks(review.books);
    }
    if (curation_id) {
      const curation: any = await Curation.findById(curation_id).populate(
        "books"
      );
      updateBooks(curation.books);
    }
    return books;
  },

  getBook: async (id: string) => {
    return await Book.findById(id);
  },

  searchBooks: async ({ query, size, page }: ISearchQuery) => {
    size = size ? size : 20;
    page = page ? page : 1;
    const options = {
      page,
      limit: size,
      select: "authors contents thumbnail title"
    };
    const { docs, totalDocs, hasNextPage, totalPages } = await Book.paginate(
      {
        title: { $regex: new RegExp(query, "i") }
      },
      options
    );
    return {
      results_count: totalDocs,
      pageable_count: totalPages,
      current_page: page,
      is_end: !hasNextPage,
      books: docs
    };
  }
};

export default bookService;
