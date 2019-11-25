import { Client } from "@elastic/elasticsearch";
const client: Client = new Client({ node: process.env.ES_HOST });
export default client;
