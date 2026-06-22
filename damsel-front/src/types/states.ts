export class GlobalState {
  myId: string | undefined;
  menuDiv: HTMLDivElement | undefined;
  loggedIn: boolean = false;
  jwt: string = "";
  socket: WebSocket | undefined;
  game: {
    id: string,
    whiteId: string,
    blackId: string,
    white: boolean,
    boardMap: number[][],
  } | undefined
};
