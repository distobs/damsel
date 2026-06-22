//import { jwtDecode } from "jwt-decode";

import { makeInitialBoard } from "../game/board";
import { gamePage } from "../pages/game";
import type { GlobalState } from "../types/states";

const server_port = 3001

// CALLBACKS
// log message on message event
export function sck_logger(ev: MessageEvent<any>) {
  console.log(ev.data);
}

// authorize on open event
export function sck_auth(siteState: GlobalState) {
  return async () => {
    await siteState.socket!.send(JSON.stringify({ type: "AUTH", token: siteState.jwt }));
  }
}

// handle proposed and accepted challenges on message event
export function sck_challenge_monitor(siteState: GlobalState) {
  return async (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);

    switch (data.type) {
      case "CHAL":
        const from = data.from;
        const res = await fetch(`http://localhost:3000/user?id=${from}`);
        const jres = await res.json();
        const login = jres.login;

        const conf = confirm(`Você aceita o desafio de ${login}?`);

        if (conf) {
          console.log("Desafio aceito!");
          await siteState.socket!.send(JSON.stringify({ type: "ACPT" }));
          console.log("Esperando retorno de começo de jogo.");
        }

        break;
      case "STRT":
        const white = data.white == siteState.myId;
        const boardMap = makeInitialBoard();

        siteState.game = { id: data.gameId, whiteId: data.white, blackId: data.black, white, boardMap };

        console.log("O jogo começou.");

        gamePage(siteState);

        break;
    }
  }
}


// UTILITIES

// Send a challenge
export async function sck_challenge(siteState: GlobalState, target: string) {
  await siteState.socket!.send(JSON.stringify({ type: "CHAL", user: target }));
  console.log("caboco desafiado");
}

// Connect to the socket
export function sck_connect(siteState: GlobalState): WebSocket {
  const socket = new WebSocket(`ws://localhost:${server_port}`);

  socket.addEventListener("open", sck_auth(siteState));
  socket.addEventListener("message", sck_logger);
  socket.addEventListener("message", sck_challenge_monitor(siteState));

  return socket;
}
