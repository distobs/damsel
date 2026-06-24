import { setupBoard } from "../game/board";
import { resign, draw } from "../game/endgame";
import type { GlobalState } from "../types/states";


export async function getOppLogin(opp: string) {
  const response = await fetch(`http://localhost:3000/user?id=${opp}`);

  const user = await response.json();
  return user.login;
}

export async function gamePage(siteState: GlobalState) {
  const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

  contentDiv.innerHTML = `
  <p class="m-0 p-0" id="playerNames"></p>
  <canvas id="board"></canvas>
  <div class="d-flex flex-row gap-3">
  <a href="" id="resign" class="text-white menu-link">Desistir</a>
  <a href="" id="offerDraw" class="text-white menu-link">Empatar</a>
  </div>
  `;
  contentDiv.style = "padding-top: 18vh";

  const names = document.querySelector<HTMLParagraphElement>("#playerNames")!;
  const board = document.querySelector<HTMLCanvasElement>("#board")!;
  const resignButton = document.querySelector<HTMLAnchorElement>("#resign")!;
  const drawButton = document.querySelector<HTMLAnchorElement>("#offerDraw")!;

  resignButton.addEventListener("click", resign(siteState));
  drawButton.addEventListener("click", draw(siteState));
  
  const opp = (siteState.game!.white) ? siteState.game!.blackId : siteState.game!.whiteId;
  const logme = await getOppLogin(siteState.myId!);
  const logopp = await getOppLogin(opp);
  const tmp = ["(pretas)", "(brancas)"];

  names.innerHTML = `${logme} ${tmp[+siteState.game!.white]} x ${logopp} ${tmp[+!(siteState.game!.white)]}`;

  setupBoard(siteState, board);
};
