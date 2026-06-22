import { render } from "../main";
import type { GlobalState } from "../types/states";
import { sck_challenge } from "./socket";

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

    const user = await response.json();
    const userId = user._id;

    await sck_challenge(siteState, userId);
    
    render();
  };
};
