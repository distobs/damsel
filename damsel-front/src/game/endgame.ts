import { render } from "../main";
import type { GlobalState } from "../types/states";

export function resign(siteState: GlobalState) {
  return async (ev: PointerEvent) => {
    ev.preventDefault();

    const conf = confirm("Quer mesmo desistir do jogo?");

    if (conf) {
      siteState.socket!.send(JSON.stringify({ type: "RSGN" }));
      alert("Você desistiu do jogo.");
      render()
    }
  }
}

export function draw(siteState: GlobalState) {
  return async (ev: PointerEvent) => {
    ev.preventDefault();

    siteState.socket!.send(JSON.stringify({ type: "DRAW" }));
  }
}
