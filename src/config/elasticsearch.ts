import { Client } from "@elastic/elasticsearch";
import migrateBooks from "./esmigration/migrateBooks";
import dotenv from "dotenv";
dotenv.config();
const client: Client = new Client({
  cloud: {
    id: process.env.ES_CLOUD_ID,
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD
  }
});

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
  try {
    // await client.indices.delete({ index: "books" }); // For restarting ES
    const existing = await client.indices.exists({ index: "books" });
    if (!existing.body) {
      await client.indices.create({ index: "books", body });
      migrateBooks();
    }
  } catch (error) {
    console.log(error);
  }
})();

export default client;
