import { Document } from "mongoose";
import Rating from "../models/Rating";

interface IQuery {
  books: string[];
  user: string;
}

interface IRating extends Document {
  book: string;
  user: string;
  rating: number;
}

const ratingService = {
  getRatings: async (query: IQuery) => {
    const returnArr = [];
    const { books, user } = query;
    for (const book of books) {
      const filter = { book, user };
      const userRating = user
        ? await Rating.findOne(filter).select("rating")
        : null;
      const ratings = await Rating.find({ book });
      if (ratings.length === 0) {
        continue; // Do not add specified book to array
      }
      const avgRating =
        ratings.reduce((sum: number, document: IRating) => {
          return document.rating + sum;
        }, 0) / ratings.length;
      returnArr.push({
        book,
        avg_rating: avgRating,
        user_rating: userRating
      });
    }
    return returnArr;
  },

  postRating: async ({
    book,
    user,
    rating
  }: {
    book: string;
    user: string;
    rating: number;
  }) => {
    const existing = await Rating.findOne({ book, user });
    if (existing) {
      return Promise.reject({
        status: 409,
        type: "DuplicateRating",
        message: "이미 평점을 매긴 책입니다."
      });
    }
    let newRating = new Rating({ book, user, rating });
    newRating = await newRating.save();
    return newRating;
  }
};

export default ratingService;
