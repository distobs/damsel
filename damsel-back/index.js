import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

dotenv.config();

// db conn

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

await run();

const db = client.db("damsel");

const usersCol = db.collection("users");

await usersCol.createIndex(
  { login: 1 },
  { unique: true }
);

// express

const app = express();

const port = 3000;

const saltrounds = 12;

app.use(express.json());

app.use(cors());

app.post("/signup", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send({
      message: "Request inválido.",
    });
  }

  try {
    const hash = await bcrypt.hash(
      password,
      saltrounds
    );

    await usersCol.insertOne({
      login,
      password: hash,
    });

    return res.status(200).send({
      message: "Sucesso.",
    });

  } catch (e) {
    return res.status(500).send({
      message: `Erro: ${e.message}`,
    });
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).send({
      message: "Request inválido.",
    });
  }

  try {
    const user =
      await usersCol.findOne({
        login,
      });

    if (!user) {
      return res.status(404).send({
        message: "Usuário não encontrado",
      });
    }

    const result =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!result) {
      return res.status(403).send({
        message: "Não autorizado.",
      });
    }

    const token = jwt.sign(
      {
        login: user.login
      },
      process.env.SECRET_KEY,
      {
        subject: user._id.toString(),
        expiresIn: 3600,
      }
    );

    return res.status(200).send({
      message: token,
    });

  } catch (e) {
    return res.status(500).send({
      message: `Erro: ${e.message}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Open: ${port}`);
});
