import { MongoClient, config } from "../deps.ts";

const { CLUSTER_URL, DATABASE, USERNAME_DB, PASSWORD_DB } = config();

const client = new MongoClient();

await client.connect(
  `mongodb+srv://${USERNAME_DB}:${PASSWORD_DB}@${CLUSTER_URL}/${DATABASE}?authMechanism=SCRAM-SHA-1`
);

export const db = client.database(DATABASE);
