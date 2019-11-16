import { Document, Schema } from "mongoose";
import Curation from "../models/Curation";
import Review from "../models/Review";

interface IQuery {
  book_id: string;
  curation_id: string;
  list_type: string;
  user_id: string;
}

const reviewService = {
  getReviews: async (query: IQuery) => {
    let reviews: Document[];
    const { book_id, curation_id, list_type, user_id } = query;

    // Update reviews array each time to take the intersection of all queries
    function updateReviews(reviewArr: Document[]): void {
      if (!reviews) {
        reviews = reviewArr;
      } else {
        reviews = reviews.filter((a: Document) => {
          return reviewArr.some((b: Document) => b.id === a.id);
        });
      }
    }

    if (list_type) {
      if (list_type === "recommended") {
        // Get 20 reviews with most likes
        const allReviews = await Review.find();
        allReviews.sort((a: any, b: any) => b.likes.length - a.likes.length);
        updateReviews(allReviews.slice(0, 20));
      } else if (list_type === "my_likes") {
        updateReviews(await Review.find({ likes: user_id }));
      } else if (list_type === "personal") {
        updateReviews(await Review.find({ author: user_id }));
      }
    }

    if (book_id) {
      // Get all reviews about a specific book
      updateReviews(await Review.find({ books: book_id }));
    }

    if (curation_id) {
      // Get reviews that are contained in a specific curation
      const curation: any = await Curation.findById(curation_id).populate(
        "reviews"
      );
      updateReviews(curation.reviews);
    }

    return reviews.map((review: any) => review.toClient());
  }
};

export default reviewService;
