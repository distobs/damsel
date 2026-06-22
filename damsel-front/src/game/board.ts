import type { GlobalState } from "../types/states";

/* DRAWING */
let canvas: HTMLCanvasElement;

function drawSquares(ctx: CanvasRenderingContext2D) {
  let side = canvas.width;
  let sqSide = side / 8;
  let colors = ["#eedc97", "#241a0f"];
  let tmp = 0;

  for (let i = 0; i < side; i += sqSide) {
    for (let j = 0; j < side; j += sqSide) {
      ctx.fillStyle = colors[tmp];
      ctx.fillRect(j, i, sqSide, sqSide);

      tmp = (tmp == 0) ? 1 : 0;
    }

    tmp = (tmp == 0) ? 1 : 0;
  }
}

function drawBoard(boardMap: number[][], canvas: HTMLCanvasElement) {
  let ctx = canvas.getContext("2d")!;

  canvas.width = 200;
  canvas.height = 200;

  drawSquares(ctx);
}

/* MOUSE EVENT HANDLING */

function getCoords(canvas: HTMLCanvasElement, event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();

  const scale = canvas.width / rect.width;

  return {
    x: (event.clientX - rect.left) * scale,
    y: (event.clientY - rect.top) * scale,
  }
}

function coordToSquare(x: number, y: number): { sx: number, sy: number } {
  const side8 = canvas.width / 8;

  return { sx: Math.trunc(x / side8), sy: Math.trunc(y / side8) };
}

function mouseHandler(event: MouseEvent) {
  event.preventDefault();

  if (event.button != 0) {
    return;
  }

  const { x, y } = getCoords(canvas, event)
  const { sx, sy } = coordToSquare(x, y);

  console.log(sx, sy);
}

/* AUX */
const pieces = Object.freeze({
  NONE: 0,
  WHITE: 1,
  BLACK: 2,
  WHITEQN: 3,
  BLACKQN: 4
});

export function makeInitialBoard() {
  let board: number[][] = []

  for (let i = 0; i < 8; ++i) {
    board.push([]);

    for (let j = 0; j < 8; ++j) {
      const playable = (i + j) % 2 === 1;

      if (!playable) {
        board[i].push(pieces.NONE);
      } else if (i < 3) {
        board[i].push(pieces.BLACK);
      } else if (i > 4) {
        board[i].push(pieces.WHITE);
      } else {
        board[i].push(pieces.NONE);
      }
    }
  }

  return board;
}

/* MAIN */
export function setupBoard(siteState: GlobalState, board: HTMLCanvasElement) {
  canvas = board;

  board.addEventListener("mousedown", mouseHandler);

  drawBoard(siteState.game!.boardMap, canvas);
}
