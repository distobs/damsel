export class GlobalState {
  myId: string | undefined;
  menuDiv: HTMLDivElement | undefined;
  loggedIn: boolean = false;
  jwt: string = "";
  socket: WebSocket | undefined;
  canvas: HTMLCanvasElement | undefined;
  game: {
    id: string,
    whiteId: string,
    blackId: string,
    white: boolean,
    turn: boolean, // 1 white 0 black
    boardMap: number[][],
    selected: {sx: number, sy: number} | undefined;
    target: {tx: number, ty: number} | undefined;
  } | undefined
};
