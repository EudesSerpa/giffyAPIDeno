import { MongoClient } from "../deps.ts";
// import { MongoClient, config } from "../deps.ts";

// const { CLUSTER_URL, DATABASE, USERNAME_DB, PASSWORD_DB } = config();

const client = new MongoClient();

try {
  // Environment Variablesin Deno Deploy
  await client.connect(
    `mongodb+srv://${Deno.env.get("USERNAME_DB")}:${Deno.env.get(
      "PASSWORD_DB"
    )}@${Deno.env.get("CLUSTER_URL")}/${Deno.env.get(
      "DATABASE"
    )}?authMechanism=SCRAM-SHA-1`
  );

  // Connection with Environment Variables with dotEnv library (it works in local)
  // await client.connect(
  //   `mongodb+srv://${USERNAME_DB}:${PASSWORD_DB}@${CLUSTER_URL}/${DATABASE}?authMechanism=SCRAM-SHA-1`
  // );
} catch (err) {
  console.error("Error connecting to MongoDB", err);
  throw err; // To chaning the error
}

export const db = client.database(Deno.env.get("DATABASE"));
