//import { jwtDecode } from "jwt-decode";

const server_port = 3001

export function sck_connect(jwt: string): WebSocket {
  const socket = new WebSocket(`ws://localhost:${server_port}`);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "AUTH", token: jwt }));
  });

  socket.addEventListener("message", (ev) => {
    console.log(ev.data);
  });

  return socket;
}
