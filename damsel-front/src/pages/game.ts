import { setupBoard } from "../game/board";
import type { GlobalState } from "../types/states";

export function gamePage(siteState: GlobalState) {
  const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

  contentDiv.innerHTML = `<canvas id="board"></canvas>`;

  const board = document.querySelector<HTMLCanvasElement>("#board")!;

  setupBoard(siteState, board);
};