//import { jwtDecode } from "jwt-decode";

import { updateBoard } from "../game/board";
import { render } from "../main";
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
    siteState.socket!.send(JSON.stringify({ type: "AUTH", token: siteState.jwt }));
  }
}

// handle proposed and accepted challenges on message event
export function sck_msg_monitor(siteState: GlobalState) {
  return async (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);

    switch (data.type) {
      case "DRAW": {
        console.log(" eu existor");
        const conf = confirm("O oponente deseja empatar. Deseja aceitar a oferta de empate?");

        if (conf) {
          siteState.socket!.send(JSON.stringify({ type: "ACDW" }));
        } else {
          siteState.socket!.send(JSON.stringify({ type: "RFDW" }));
        }

        break;
      }
      case "CHAL":
        const from = data.from;
        const res = await fetch(`http://localhost:3000/user?id=${from}`);
        const jres = await res.json();
        const login = jres.login;

        const conf = confirm(`Você aceita o desafio de ${login}?`);

        if (conf) {
          console.log("Desafio aceito!");
          siteState.socket!.send(JSON.stringify({ type: "ACPT" }));
          console.log("Esperando retorno de começo de jogo.");
        }

        break;
      case "STRT":
        const white = data.white == siteState.myId;
        const boardMap = data.board;

        siteState.game = { id: data.gameId, whiteId: data.white, blackId: data.black, white, turn: true, boardMap, selected: undefined, target: undefined };

        console.log("O jogo começou.");

        gamePage(siteState);

        break;
      case "MOVE":
        siteState.game!.boardMap = data.board;
        siteState.game!.turn = !siteState.game!.turn;
        siteState.game!.selected = siteState.game!.target = undefined;
        updateBoard(siteState);
        break;
      case "GMOV":
        const g = siteState.game!;
        let win;

        if (g.turn && g.white || !g.turn && !g.white) {
          win = "VOCÊ";
        } else {
          win = "O OPONENTE";
        }

        alert(`FIM DE JOGO! ${win} venceu.`);

        render();
        break;
      case "ACDW":
        alert("O jogo termina em empate.");
        render();
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
  socket.addEventListener("message", sck_msg_monitor(siteState));

  return socket;
}
