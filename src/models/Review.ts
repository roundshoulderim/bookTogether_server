import mongoose, { Document, HookNextFunction } from "mongoose";
import { esIndexReview } from "../helpers/middleware/esIndex";
import client from "../config/elasticsearch";
const Schema: any = mongoose.Schema;

interface ISearchQuery {
  query: string;
  page: number;
  size: number;
}

interface ISearchResults {
  reviews: object[];
  results_count: number;
  pageable_count: number;
  current_page: number;
  is_end: boolean;
}

export const ReviewSchema: mongoose.Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    contents: String,
    published: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    thumbnail: String,
    title: String
  },
  { versionKey: false }
);

// Updated index in ElasticSearch after updating mongoDB
ReviewSchema.post("save", esIndexReview);
ReviewSchema.post("updateOne", esIndexReview);
ReviewSchema.post("findOneAndDelete", doc => {
  client.delete({ id: doc.id, index: "reviews", refresh: "true" });
});

// Return paginated search results from ElasticSearch
ReviewSchema.statics.search = async ({ query, page, size }: ISearchQuery) => {
  const results: ISearchResults = {} as ISearchResults;
  const response = await client.search({
    index: "reviews",
    from: (page - 1) * size,
    size,
    sort: "_score",
    body: {
      query: {
        bool: {
          should: [
            {
              nested: {
                path: "author",
                query: {
                  match: { "author.name": { query, analyzer: "standard" } }
                }
              }
            },
            {
              nested: {
                path: "books",
                query: {
                  multi_match: {
                    query,
                    analyzer: "standard",
                    fields: ["books.authors", "books.title^2"]
                  }
                }
              }
            },
            { match: { title: { query, analyzer: "standard", boost: 2 } } }
          ]
        }
      }
    }
  });
  results.reviews = response.body.hits.hits.map((result: any) => {
    result._source._id = result._id;
    delete result.books;
    return result._source;
  });
  results.results_count = response.body.hits.total.value;
  results.pageable_count = Math.ceil(results.results_count / size);
  results.current_page = page;
  results.is_end = page >= results.pageable_count;
  return results;
};

const Review: any = mongoose.model("Review", ReviewSchema);

export default Review;
