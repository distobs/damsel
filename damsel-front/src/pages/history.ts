import { drawBoard, makeBoard } from "../game/board";
import { histMoveApplier } from "../game/histmoveapplier";
import type { GlobalState } from "../types/states";

export function historyPage(
  white: boolean,
  myTag: string,
  theirTag: string,
  dt: string,
  hist: any
) {
  return async (ev: MouseEvent) => {
    ev.preventDefault();
    const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

    contentDiv.innerHTML = `
<p class="m-0 p-0" id="playerNames"></p>
<canvas id="board"></canvas>
<div id="movelist" class="row w-75">
</div>
`;

    contentDiv.style = "padding-top: 18vh";

    const names = document.querySelector<HTMLParagraphElement>("#playerNames")!;
    const board = document.querySelector<HTMLCanvasElement>("#board")!;
    const movelist = document.querySelector<HTMLDivElement>("#movelist")!;

    names.innerHTML = `${myTag} x ${theirTag} (${dt})`;

    let boardMap = makeBoard();

    let idx = 0;

    for (let move of hist.moves) {
      const format = `${idx + 1}. [(${move[0].sx},${move[0].sy}),(${move[1].tx},${move[1].ty})]`;
      movelist.insertAdjacentHTML("beforeend",
        `<a class="text-white menu-link col" href="" id="mv${idx}">${format}</a>`
      );

      if (idx % 4 == 0 && idx) {
        movelist.insertAdjacentHTML(
          "beforeend",
          `<div class="w-100"></div>`
        );
      }

      const mvidx = document.querySelector<HTMLAnchorElement>(`#mv${idx}`)!;
      const moveIdx = idx;


      mvidx.addEventListener("click", (ev: MouseEvent) => {
        ev.preventDefault();

        const boardState = histMoveApplier(
          makeBoard(),
          hist.moves.slice(0, moveIdx + 1)
        );

        drawBoard(white, boardState, board);
      });

      ++idx;
    }

    drawBoard(white, boardMap, board);
  }
};
