import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { makeBoard } from "./game.js";

const port = 3001;

const playerGames = new Map();
const games = new Map();
const challenges = new Map();
const clients = new Map();

export function setup_ws() {
  const wss = new WebSocketServer({ port });

  wss.on("listening", () => {
    console.log(`WSS on ${port}`);
  });

  wss.on("connection", (ws) => {
    ws.authenticated = false;

    ws.on("error", console.error);

    ws.on("message", (data) => {
      let msg;

      try {
        msg = JSON.parse(data);
      } catch {
        ws.close();
        return;
      }

      console.log(msg);

      if (!ws.authenticated) {
        if (msg.type !== "AUTH") {
          ws.close();
          return;
        } else {
          try {
            const payload = jwt.verify(msg.token, process.env.SECRET_KEY);

            if (typeof payload !== "object") {
              ws.close();
              return;
            }

            if (!payload.sub) {
              ws.close();
              return;
            }

            ws.userId = payload.sub;

            ws.authenticated = true;

            clients.get(ws.userId)?.close();

            clients.set(
              ws.userId,
              ws
            );

            ws.send(
              JSON.stringify({
                type: "AUTH_OK",
              })
            );
          } catch (e) {
            console.log("Error: ", e.message);
            ws.close();
          }

          return;
        }
      }

      switch (msg.type) {
        case "CHAL":
          const challengerId = ws.userId;
          const targetId = msg.user;

          // can't challenge yourself buddy
          if (targetId === challengerId) {
            return;
          }

          const targetClient = clients.get(targetId);

          if (!targetClient) {
            return;
          }

          // that player's already been challenged
          if (challenges.get(targetId)) {
            return;
          }

          // map target => challenger
          challenges.set(
            targetId,
            challengerId
          )

          targetClient.send(JSON.stringify({
            type: "CHAL",
            from: ws.userId,
          }));

          break;
        case "ACPT":
          const challenger = challenges.get(ws.userId);

          if (!challenger) {
            return;
          }

          if (!clients.has(challenger)) {
            challenges.delete(ws.userId);
            return;
          }

          const gameId = crypto.randomUUID();

          const white = (Math.random() < 0.5) ? ws.userId : challenger;
          const black = (white == ws.userId) ? challenger : ws.userId;

          games.set(
            gameId,
            {
              white,
              black,
              turn: white,
              board: makeBoard(),
            }
          )

          playerGames.set(white, gameId);
          playerGames.set(black, gameId);

          challenges.delete(ws.userId);

          const start = JSON.stringify(({
            type: "STRT",
            gameId,
            white,
            black,
          }));

          clients.get(white)?.send(start);
          clients.get(black)?.send(start);

          break;
        case "MOVE":
          handleMove(
            games,
            playerGames.get(ws.userId),
            clients,
            ws.userId,
            msg
          );

          break;
      }
    });

    ws.on("close", () => {
      clients.delete(ws.userId);
      challenges.delete(ws.userId);

      console.log("RESIGN IS NOT HANDLED YET");
    });
  });
}
