import { loginAuth } from "../auth/login";
import type { GlobalState } from "../types/states";

export function loginPage(menuDiv: HTMLDivElement, siteState: GlobalState) {
  return (event: MouseEvent) => {
    event.preventDefault();
    menuDiv.innerHTML = `<form class="d-flex flex-column gap-3" id="loginForm">
      <div>
        <label for="logininput">Login:</label>
        <input id="logininput" name="login">
      </div>

      <div>
        <label for="senhainput">Senha:</label>
        <input type="password" id="senhainput" name="senha">
      </div>
      <div class="d-flex justify-content-center">
        <input id="loginsubmit" type="submit" value="Enviar">
      </div>
    </form>`;

    const loginForm = document.querySelector<HTMLFormElement>("#loginForm")!;

    loginForm.addEventListener("submit", loginAuth(siteState, loginForm));
  };
}
