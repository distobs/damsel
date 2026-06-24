import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { handleMove } from "./game.js";
import { makeBoard } from "./game.js";
import { ObjectId } from "mongodb";

const port = 3001;

const playerGames = new Map();
const games = new Map();
const challenges = new Map();
const clients = new Map();

export async function setup_ws(usersCol) {
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
          // target sends ACPT
          const target = ws.userId;
          const challenger = challenges.get(target);

          if (!challenger) {
            return;
          }

          if (!clients.has(challenger)) {
            challenges.delete(target);
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
              history: [],
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
            board: makeBoard()
          }));

          clients.get(white)?.send(start);
          clients.get(black)?.send(start);

          break;
        case "DRAW": {
          const gameId = playerGames.get(ws.userId);
          const game = games.get(gameId);
          const opp = (ws.userId == game.white) ? game.black : game.white;

          console.log("eu existo");
          clients.get(opp).send(JSON.stringify({ type: "DRAW" }));

          break;
        }
        case "ACDW": {
          const gameId = playerGames.get(ws.userId);
          const game = games.get(gameId);

          usersCol.updateOne({ _id: ObjectId(game.white) },
            {
              $push: {
                history: { opponent: game.black, moves: game.history, winner: "DRAW" }
              }
            }
          );

          usersCol.updateOne({ _id: ObjectId(game.black) },
            {
              $push: {
                history: { opponent: game.white, moves: game.history, winner: "DRAW" }
              }
            }
          );

          playerGames.delete(games.white);
          playerGames.delete(games.black);
          games.delete(gameId);

          break;
        }
        case "RFDW": {
          const gameId = playerGames.get(ws.userId);
          const game = games.get(gameId);
          const opp = (ws.userId == game.white) ? game.black : game.white;

          clients.get(opp).send(JSON.stringify({ type: "RFDW" }));

          break;
        }
        case "RSGN": {
          const gameId = playerGames.get(ws.userId);
          const game = games.get(gameId);
          const opp = (ws.userId == game.white) ? game.black : game.white;

          usersCol.updateOne({ _id: ObjectId(game.white) },
            {
              $push: {
                history: { opponent: game.black, moves: game.history, winner: opp }
              }
            }
          );

          usersCol.updateOne({ _id: ObjectId(game.black) },
            {
              $push: {
                history: { opponent: game.white, moves: game.history, winner: opp }
              }
            }
          );

          playerGames.delete(games.white);
          playerGames.delete(games.black);
          games.delete(gameId);

          break;
        }
        case "MOVE": {
          const gameId = playerGames.get(ws.userId);
          const game = games.get(gameId);
          const white = ws.userId == game.white;

          if (!game) {
            return;
          }

          const gameover = handleMove(
            game,
            white,
            clients,
            msg.selected,
            msg.target,
          );

          game.history.push([msg.selected, msg.target]);

          if (gameover) {
            const GMOV = JSON.stringify({
              type: "GMOV",
              board: game.board,
              winner: ws.userId,
            });

            usersCol.updateOne({ _id: ObjectId(game.white) },
              {
                $push: {
                  history: { opponent: game.black, moves: game.history, winner: ws.userId }
                }
              }
            );

            usersCol.updateOne({ _id: ObjectId(game.black) },
              {
                $push: {
                  history: { opponent: game.white, moves: game.history, winner: ws.userId }
                }
              }
            );

            clients.get(game.white)?.send(GMOV);
            clients.get(game.black)?.send(GMOV);

            playerGames.delete(game.white);
            playerGames.delete(game.black);
            games.delete(gameId);
          } else {
            const MOVE = JSON.stringify({
              type: "MOVE",
              board: game.board,
            });

            clients.get(game.white)?.send(MOVE);
            clients.get(game.black)?.send(MOVE);
          }

          break;
        }
      }
    });

    ws.on("close", () => {
      clients.delete(ws.userId);
      challenges.delete(ws.userId);
    });
  });
}
