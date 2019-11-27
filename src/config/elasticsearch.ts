import { Client } from "@elastic/elasticsearch";
import { migrateBooks } from "./esmigration";
import dotenv from "dotenv";
dotenv.config();
const client: Client = new Client({ node: process.env.ES_HOST });
const body = {
  settings: {
    analysis: {
      filter: {
        autocomplete_filter: {
          type: "edge_ngram",
          min_gram: 1,
          max_gram: 40
        }
      },
      analyzer: {
        autocomplete: {
          filter: ["lowercase", "autocomplete_filter"],
          type: "custom",
          tokenizer: "whitespace"
        }
      }
    }
  },
  mappings: {
    properties: {
      authors: {
        type: "text",
        analyzer: "autocomplete"
      },
      title: {
        type: "text",
        analyzer: "autocomplete"
      }
    }
  }
};

(async (): Promise<void> => {
  const existing = await client.indices.exists({ index: "books" });
  if (!existing.body) {
    await client.indices.create({ index: "books", body });
    migrateBooks();
  }
})();
export default client;
