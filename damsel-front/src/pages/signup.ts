import { signupAuth } from "../auth/signup";
import type { GlobalState } from "../types/states";

export function signupPage(siteState: GlobalState) {
  const menuDiv = siteState.menuDiv!;

  return (event: MouseEvent) => {
    event.preventDefault();
    menuDiv.innerHTML = `<form class="d-flex flex-column gap-3" id="signupForm">
      <div>
        <label for="logininput">Login:</label>
        <input id="logininput" name="login">
      </div>

      <div>
        <label for="senhainput">Senha:</label>
        <input type="password" id="senhainput" name="senha">
      </div>
      <div class="d-flex justify-content-center">
        <input id="signupsubmit" type="submit" value="Enviar">
      </div>
    </form>`;

    const signupForm = document.querySelector<HTMLFormElement>("#signupForm")!;

    signupForm.addEventListener("submit", signupAuth(signupForm));
  };
}
