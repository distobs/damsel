import { setupBoard } from "../game/board";
import type { GlobalState } from "../types/states";

export function gamePage(siteState: GlobalState) {
  const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

  contentDiv.innerHTML = `
  <canvas id="board"></canvas>
  <div class="d-flex flex-row gap-3">
  <a href="" id="resign" class="text-white menu-link">Desistir</a>
  <a href="" id="offerDraw" class="text-white menu-link">Empatar</a>
  </div>
  `;
  contentDiv.style = "padding-top: 18vh";

  const board = document.querySelector<HTMLCanvasElement>("#board")!;
  const resignButton = document.querySelector<HTMLAnchorElement>("#resign");
    const drawButton = document.querySelector<HTMLAnchorElement>("#resign");
  setupBoard(siteState, board);
};