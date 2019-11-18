import { Document } from "mongoose";
import Curation from "../models/Curation";
import Review from "../models/Review";
import Unauthorized from "../helpers/errors/unauthorized";

interface IQuery {
  book_id: string;
  curation_id: string;
  list_type: string;
  user_id: string;
}

interface IReview extends Document {
  author: string;
  books: string[];
  contents: string;
  likes: string[];
  published: boolean;
  thumbnail: string;
  title: string;
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
        const allReviews = await Review.find().select("-books");
        allReviews.sort((a: any, b: any) => b.likes.length - a.likes.length);
        updateReviews(allReviews.slice(0, 20));
      } else if (list_type === "my_likes") {
        updateReviews(await Review.find({ likes: user_id }).select("-books"));
      } else if (list_type === "personal") {
        updateReviews(await Review.find({ author: user_id }).select("-books"));
      }
    }
    if (book_id) {
      // Get all reviews about a specific book
      updateReviews(await Review.find({ books: book_id }).select("-books"));
    }
    if (curation_id) {
      // Get reviews that are contained in a specific curation
      const curation: any = await Curation.findById(curation_id).populate({
        path: "reviews",
        select: "-books"
      });
      updateReviews(curation.reviews);
    }
    return reviews;
  },

  getReview: async (id: string) => {
    return await Review.findById(id)
      .populate({
        path: "author",
        select: "image name profile"
      })
      .select("-books");
  },

  postReview: async (postBody: IReview) => {
    const review: Document = new Review(postBody);
    await review.save();
    return await Review.findById(review.id)
      .populate({
        path: "author",
        select: "image name profile"
      })
      .select("-books");
  },

  patchReview: async (patchBody: IReview, id: string) => {
    const review = await Review.findById(id);
    if (!review) {
      return Promise.reject({
        status: 404,
        type: "ReviewNotFound",
        message: "해당 서평에 대한 정보를 찾지 못했습니다."
      });
    }
    if ((review as IReview).author !== patchBody.author) {
      return Promise.reject(Unauthorized("해당 서평에 접근 권한이 없습니다."));
    }
    const updatedReview = await review
      .updateOne(patchBody)
      .populate({
        path: "author",
        select: "image name profile"
      })
      .select("-books");
    return updatedReview;
  },

  postLike: async (review_id: string, user_id: string) => {
    const review = await Review.findById(review_id);
    if (!review) {
      return Promise.reject({
        status: 404,
        type: "ReviewNotFound",
        message: "해당 서평에 대한 정보를 찾지 못했습니다."
      });
    }
    if ((review as IReview).likes.includes(user_id)) {
      return Promise.reject({
        status: 409,
        type: "DuplicateLike",
        message: "이미 좋아요를 한 서평입니다."
      });
    }
    (review as IReview).likes.push(user_id);
    await review.save();
  },

  deleteLike: async (review_id: string, user_id: string) => {
    const review: IReview = (await Review.findById(review_id)) as IReview;
    if (!review) {
      return Promise.reject({
        status: 404,
        type: "ReviewNotFound",
        message: "해당 서평에 대한 정보를 찾지 못했습니다."
      });
    }
    const index = review.likes.indexOf(user_id);
    if (index === -1) {
      return Promise.reject({
        status: 404,
        type: "LikeNotFound",
        message: "해당 좋아요에 대한 정보를 찾지 못했습니다."
      });
    }
    review.likes.splice(index, 1);
    await review.save();
  }
};

export default reviewService;
