export function challengePage(menuDiv: HTMLDivElement) {
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

    const challengeForm = document.querySelector<HTMLFormElement>("#challengeForm")!;

    challengeForm.addEventListener("submit", (event) => { event.preventDefault(); console.log("desafio foda"); });
  };
}
