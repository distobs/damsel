import type { GlobalState } from "../types/states";

/* DRAWING */
let canvas: HTMLCanvasElement;

export const pieces = Object.freeze({
  NONE: 0,
  WHITE: 1,
  BLACK: 2,
  WHITEQN: 3,
  BLACKQN: 4
});

export function makeBoard() {
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

function getSqCenter(canvas: HTMLCanvasElement, pos: {x: number, y: number}) {
  let sqside = canvas.width / 8;
  let sqx = pos.x * sqside;
  let sqy = pos.y * sqside;
  let sqc = {x: sqx + sqside / 2, y: sqy + sqside / 2};

  return sqc;
}

function drawPiece(ctx: CanvasRenderingContext2D, center: {x: number, y: number}, piece: number, sqSide: number) {
  if (piece == pieces.NONE) {
    return;
  }

  switch (piece) {
    case pieces.WHITE:
      ctx.fillStyle = "white";
      break;
    case pieces.BLACK:
      ctx.fillStyle = "green";
      break;
    default:
      break;
  }
  
  ctx.beginPath();
  ctx.arc(center.x, center.y, sqSide / 2 - 3, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawSelectedSquare(ctx: CanvasRenderingContext2D, sqCenter: {x: number, y: number}) {
  ctx.fillStyle = "red";

  ctx.beginPath();
  ctx.arc(sqCenter.x, sqCenter.y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawSquares(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
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

function drawMap(boardMap: number[][], canvas: HTMLCanvasElement) {
  let ctx = canvas.getContext("2d")!;

  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      drawPiece(ctx, getSqCenter(canvas, {x: j, y: i}), boardMap[i][j], canvas.width / 8); 
    }
  }
}

export function drawBoard(white: boolean, boardMap: number[][], canvas: HTMLCanvasElement, selected?: {sx: number, sy: number}) {
  let ctx = canvas.getContext("2d")!;

  canvas.width = 500;
  canvas.height = 500;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  if (!white) {
    ctx.rotate(Math.PI);
    ctx.translate(-canvas.width, -canvas.height);
  }

  drawSquares(canvas, ctx);
  drawMap(boardMap, canvas);
  
  if (selected) {
    drawSelectedSquare(
      ctx,
      getSqCenter(canvas, {
        x: selected.sx,
        y: selected.sy,
      })
    );
  }

  ctx.restore();
}

/* MOUSE EVENT HANDLING */

function getCoords(canvas: HTMLCanvasElement, event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();

  const scale = canvas.width / rect.width;

  return {
    x: (event.clientX - rect.left) * scale,
    y: (event.clientY - rect.top) * scale,
  };
}

function coordToSquare(x: number, y: number): { sx: number, sy: number } {
  const side8 = canvas.width / 8;

  return { sx: Math.trunc(x / side8), sy: Math.trunc(y / side8) };
}

function validateMove(boardMap: number[][], white: boolean, selected: {sx: number, sy: number}, target: {tx: number, ty: number}) {
  const { sx, sy } = selected;
  const { tx, ty } = target;

  const myPieces = (white) ? pieces.WHITE : pieces.BLACK;

  const possibleTargets = [
    {tx: sx + 1, ty: sy + 1}, // sem cume
    {tx: sx - 1, ty: sy + 1},
    {tx: sx + 1, ty: sy - 1},
    {tx: sx - 1, ty: sy - 1},
    {tx: sx + 2, ty: sy + 2}, // cumeno
    {tx: sx - 2, ty: sy + 2},
    {tx: sx + 2, ty: sy - 2},
    {tx: sx - 2, ty: sy - 2},
  ]

  console.log("bp1");
  if (boardMap[sy][sx] != myPieces) {
    return false;
  }
  
  console.log("bp2");
  if (sx < 0 || sy < 0 || tx < 0 || ty < 0) {
    return false;
  }
  
  console.log("bp3");
  console.log(target);
  console.log(possibleTargets);
  if (!possibleTargets.some(t => t.tx == target.tx && t.ty == target.ty)) {
    return false;
  }
  
  console.log("bp4");
  if (boardMap[ty][tx] != pieces.NONE) {
    return false;
  }
  
  return true;
}

function mouseHandler(siteState: GlobalState) {
  return async (event: MouseEvent) => {
    event.preventDefault();

    if (event.button != 0) {
      return;
    }

    const { x, y } = getCoords(canvas, event)
    let { sx, sy } = coordToSquare(x, y);
    
    if (!siteState.game!.white) {
      sx = 7 - sx;
      sy = 7 - sy;
    }
    
    const game = siteState.game!;

    if (game.turn && !game.white) {
      return;
    } else if (!game.turn && game.white) {
      return;
    }
    
    if (game.selected != undefined) {
      const game = siteState.game!;
      game.target = { tx: sx, ty: sy };

      if (validateMove(
        game.boardMap,
        game.white,
        game.selected!,
        game.target!,
      )) {
        await siteState.socket!.send(JSON.stringify({
          type: "MOVE",
          selected: game.selected,
          target: game.target,
        }));
      } else {
        game.selected = game.target = undefined;
        updateBoard(siteState);
      }
    } else {
      const myPieces = (siteState.game!.white) ? pieces.WHITE : pieces.BLACK;
      console.log("OI " + siteState.game!.boardMap[sy][sx] + " " + myPieces);

      if (siteState.game!.boardMap[sy][sx] != myPieces) {
        return;
      }

      siteState.game!.selected = { sx, sy };
      updateBoard(siteState);
    }

    console.log(sx, sy);
  }
}

/* MAIN */
export function setupBoard(siteState: GlobalState, board: HTMLCanvasElement) {
  canvas = board;
  
  siteState.canvas = canvas;

  board.addEventListener("mousedown", mouseHandler(siteState));

  drawBoard(siteState.game!.white, siteState.game!.boardMap, canvas);
}

export function updateBoard(siteState: GlobalState) {
  canvas = siteState.canvas!;

  drawBoard(siteState.game!.white, siteState.game!.boardMap, canvas, siteState.game!.selected);
}