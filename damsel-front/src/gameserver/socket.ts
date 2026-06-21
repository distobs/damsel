//import { jwtDecode } from "jwt-decode";

import type { GlobalState } from "../types/states";

const server_port = 3001

// CALLBACKS
export function sck_logger(ev: MessageEvent<any>) {
  console.log(ev.data);
}

export function sck_auth(socket: WebSocket, jwt: string) {
  return async () => {
    socket.send(JSON.stringify({ type: "AUTH", token: jwt }));
  }
}

export function sck_challenge_monitor(siteState: GlobalState) {
  return async (ev: MessageEvent<any>) => {
    const data = JSON.parse(ev.data);

    if (data.type === "CHAL") {
      const from = data.from;
      const res = await fetch(`http://localhost:3000/user?id=${from}`);
      const jres = await res.json();
      const login = jres.login();
      const conf = confirm(`Você aceita o desafio de ${login}`);

      if (conf) {
        console.log("Desafio aceito!");
      }
    } else if (data.type === "ACPT") {
    }
  }
}

export function sck_connect(jwt: string): WebSocket {
  const socket = new WebSocket(`ws://localhost:${server_port}`);

  socket.addEventListener("open", sck_auth(socket, jwt));
  socket.addEventListener("message", sck_logger);

  return socket;
}
