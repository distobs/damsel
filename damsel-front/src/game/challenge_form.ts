import { render } from "../main";
import type { GlobalState } from "../types/states";

export function challengeFormHandle(siteState: GlobalState, form: HTMLFormElement) {
  return async (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(form);

    const adv = data.get("adversary");

    if (!adv) {
      alert("Adversário vazio.");
      return;
    }

    const response = await fetch(`http://localhost:3000/user?login=${adv}`);

    if (response.status != 200) {
      alert("Usuário não encontrado");
      return;
    }

    if (!siteState.socket) {
      alert("Por algum motivo, não conseguimos nos conectar ao servidor.");
      return;
    }

    const user = await response.json();
    const userId = user._id;

    siteState.socket.addEventListener("message", (ev) => {
      if (ev.data === "ACPT") {
        alert("Começou o jogo. Morram!");
        render();
      }
    });

    await siteState.socket.send(JSON.stringify({ type: "CHAL", user: userId }))
  };
};
