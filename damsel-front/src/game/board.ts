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

function drawBoard(canvas: HTMLCanvasElement) {
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

/* MAIN */
export function setupBoard(board: HTMLCanvasElement) {
  canvas = board;

  board.addEventListener("mousedown", mouseHandler);

  drawBoard(canvas);
}
