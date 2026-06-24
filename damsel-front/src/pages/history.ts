//import { setupBoard } from "../game/board";
//import { resign, draw } from "../game/endgame";
import type { GlobalState } from "../types/states";
import { getOppLogin } from "./game";

export async function historyPage(siteState: GlobalState) {
  const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

  contentDiv.innerHTML = `
  `;

  const response = await fetch(`http://localhost:3000/history?id=${siteState.myId}`);
  const history = await response.json();
  const logme = getOppLogin(siteState.myId!);
  const tmp = ["(pretas)", "(brancas)"];

  let idx = 0;

  for (let el of history) {
    const white = el.white == siteState.myId!;
    const opplog = getOppLogin(history.opponent);

    contentDiv.innerHTML += `<a id="hist${idx}" href="">${logme} ${tmp[+white]} x ${opplog} ${tmp[+!white]}`;
    
    ++idx;
  }

  contentDiv.style = "padding-top: 18vh";
};