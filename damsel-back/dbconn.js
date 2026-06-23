import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({
      ping: 1,
    });

    console.log("DB Ping OK");
  } catch (e) {
    console.log("DB not OK:", e);

    await client.close();

    process.exit(1);
  }
}

export async function setup_db() {
  await run();

  const db = client.db("damsel");

  const usersCol = db.collection("users");
  const gamesCol = db.collection("games");

  await usersCol.createIndex(
    { login: 1 },
    { unique: true }
  );
  
  return usersCol;
}

