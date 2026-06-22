import { challengeFormHandle } from "../gameserver/challenge_form";
import type { GlobalState } from "../types/states";

export function challengePage(siteState: GlobalState) {
  const menuDiv = siteState.menuDiv!;

  return (event: MouseEvent) => {
    event.preventDefault();

    menuDiv.innerHTML = `<form class="d-flex flex-column gap-4" id="challengeForm">
      <div class="d-flex flex-column gap-1">
      <label for="adversary">Adversário:</label>
      <input id="adversaryinput" name="adversary">
      </div>

      <input id="challenge" type="submit" value="Desafiar">
      </div>
    </form>`;

    const form = document.querySelector<HTMLFormElement>("#challengeForm")!;

    form.addEventListener("submit", challengeFormHandle(siteState, form))
  };
}
