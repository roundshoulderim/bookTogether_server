import { Document, DocumentQuery } from "mongoose";
import Curation from "../models/Curation";
import updateQueryResults from "../helpers/query/updateQueryResults";

interface IQuery {
  book: string;
  list_type: string;
  review: string;
  user: string;
}

interface ICuration extends Document {
  author: string;
  books: string[];
  contents: string;
  likes: string[];
  published: boolean;
  reviews: string[];
  title: string;
}

const curationService = {
  getCurations: async (query: IQuery) => {
    let curations: Document[];
    const { book, list_type, review, user } = query;

    function findMatchingCurations(
      condition: object
    ): DocumentQuery<Document[], Document, {}> {
      return Curation.find(condition)
        .populate({ path: "author", select: "image name profile" })
        .select("-books -reviews");
    }

    if (list_type) {
      if (list_type === "recommended") {
        // Get 20 curations with most likes
        const allCurations = await findMatchingCurations({});
        allCurations.sort((a: any, b: any) => b.likes.length - a.likes.length);
        curations = updateQueryResults(curations, allCurations.slice(0, 20));
      } else if (list_type === "my_likes") {
        curations = updateQueryResults(
          curations,
          await findMatchingCurations({ likes: user })
        );
      } else if (list_type === "personal") {
        curations = updateQueryResults(
          curations,
          await findMatchingCurations({ author: user })
        );
      }
    }
    if (book) {
      // Get curations that contain a specific book
      curations = updateQueryResults(
        curations,
        await findMatchingCurations({ books: book })
      );
    }
    if (review) {
      // Get curations that contain a specific review
      curations = updateQueryResults(
        curations,
        await findMatchingCurations({ reviews: review })
      );
    }
    return curations;
  }
};

export default curationService;
