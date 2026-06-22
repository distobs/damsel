import dotenv from "dotenv";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { setup_db } from "./dbconn.js";
import { setup_ws } from "./gameserver.js";
import { ObjectId } from "mongodb";

dotenv.config();

// express

const app = express();

const port = 3000;

const saltrounds = 12;

app.use(express.json());

app.use(cors());

app.get("/user", async (req, res) => {
  const login = req.query.login;
  const id = req.query.id;
  let user = undefined;

  if (!login && !id) {
    return res.status(400).send({
      message: "Request inválido",
    });
  } else if (login) {
    user = await usersCol.findOne({ login });
  } else {
    user = await usersCol.findOne({ _id: new ObjectId(id) });
  }

  if (!user) {
    return res.status(404).send({
      message: "Usuário não encontrado.",
    });
  }

  return res.status(200).send(user);
});

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

// websocket
setup_ws();

// dbconn
const usersCol = await setup_db();
