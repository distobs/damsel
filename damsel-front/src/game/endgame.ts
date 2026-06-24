import { render } from "../main";
import type { GlobalState } from "../types/states";

export function resign(siteState: GlobalState) {
  return async () => {
    const conf = confirm("Quer mesmo desistir do jogo?");

    if (conf) {
      siteState.socket!.send(JSON.stringify({ type: "RSGN" }));
      alert("Você desistiu do jogo.");
      render()
    }
  }
}

export function draw(siteState: GlobalState) {
  return async () => {
    siteState.socket!.send(JSON.stringify({ type: "DRAW" }));

    siteState.socket!.addEventListener("message", (msg: MessageEvent) => {
      if (msg.data.type == "ACDW") {
        alert("O jogo termina em empate.");
        render();
      } else if (msg.data.type == "RFDW") {
        alert("Empate negado");
      }
    })
  }
}
