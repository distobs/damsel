//import { setupBoard } from "../game/board";
//import { resign, draw } from "../game/endgame";
import type { GlobalState } from "../types/states";
import { getOppLogin } from "./game";
import { historyPage } from "./history";

export function historyListPage(siteState: GlobalState) {
  return async (ev: MouseEvent) => {
    ev.preventDefault();

    const contentDiv = document.querySelector<HTMLDivElement>("#contentdiv")!;

    contentDiv.innerHTML = `
`;

    try {
      const response = await fetch(`http://localhost:3000/history?id=${siteState.myId}`);
      const history = await response.json();
      const logme = await getOppLogin(siteState.myId!);
      const tmp = ["(pretas)", "(brancas)"];

      let idx = 0;

      for (let el of history) {
        const white = el.white == siteState.myId!;
        const winner = el.winner;
        const opplog = await getOppLogin(el.opponent);
        let myColor, theirColor;

        if (winner === siteState.myId!) {
          myColor = "green";
          theirColor = "red";
        } else if (winner === el.opponent) {
          myColor = "red";
          theirColor = "green";
        } else {
          myColor = theirColor = "gray";
        }

        const myTag = `<span style="color: ${myColor};">${logme} ${tmp[+white]}</span>`;
        const theirTag = `<span style="color: ${theirColor};">${opplog} ${tmp[+!white]}</span>`;

        const dt = new Date(el.startDate).toLocaleString();

        contentDiv.innerHTML +=
          `<a id="hist${idx}" href="" class="text-white menu-link">
          ${myTag} x ${theirTag} (${dt})
        </a>`;

        const link = document.querySelector<HTMLAnchorElement>(`#hist${idx}`)!;

        link.addEventListener("click", historyPage(white, myTag, theirTag, dt, el));

        ++idx;
      }

      contentDiv.style = "padding-top: 18vh";
    } catch (err) {
      console.log("Me derrubaro aqui ");
      console.log(err);
    };
  };
}
