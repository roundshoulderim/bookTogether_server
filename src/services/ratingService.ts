import { Document } from "mongoose";
import Rating from "../models/Rating";

interface IQuery {
  book_ids: string[];
  user_id: string;
}

interface IRating extends Document {
  book: string;
  user: string;
  rating: number;
}

const ratingService = {
  getRatings: async (query: IQuery) => {
    const returnArr = [];
    const { book_ids, user_id } = query;
    for (const id of book_ids) {
      const filter = { book: id, user: user_id };
      const userRating = user_id
        ? await Rating.findOne(filter).select("rating")
        : null;
      const ratings = await Rating.find({ book: id });
      if (ratings.length === 0) {
        continue; // Do not add specified book to array
      }
      const avgRating =
        ratings.reduce((sum: number, document: IRating) => {
          return document.rating + sum;
        }, 0) / ratings.length;
      returnArr.push({
        book: id,
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
