import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const port = 3000;

const games = new Map();
const challenges = new Map();
const clients = new Map();

const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  ws.authenticated = false;

  ws.on("error", console.error);

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

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
        if (msg.user === ws.userId) {
          return;
        }

        const target = clients.get(msg.user);

        if (!target) {
          return;
        }

        challenges.set(
          msg.user,
          ws.userId
        )

        target.send(JSON.stringify({
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
            board: []
          }
        )

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
        handleMove(ws.userId, msg);

        break;
    }
  });

  ws.on("close", () => {
    clients.delete(ws.userId);
  });
});
