import './style.css';
import { GlobalState } from './types/states.ts';
import { pageRender } from './pages/page_renderer.ts';

let siteState: GlobalState = new GlobalState();

export function render() {
  const appDiv = document.querySelector<HTMLDivElement>('#app')!;

  appDiv.innerHTML = `<div class="d-flex flex-column justify-content-center align-items-center"
    style="padding-top: 25vh;">
    <div id="titlediv" class="d-flex flex-row align-items-center gap-2">
      <h1 class="d-flex justify-content-center m-0">DAMSEL</h1>
    </div>

    <div id="menu" class="d-flex flex-row mt-5 gap-4">
    </div>
  </div>`;

  const menuDiv = document.querySelector<HTMLDivElement>("#menu")!
  if (siteState.loggedIn) {
    const loggedMenu = `
<a href="" id="challengelink" class="text-white menu-link">Desafiar</a>
<a href="" id="historylink" class="text-white menu-link">Ver Histórico</a>
<a href="" id="logofflink" class="text-white menu-link">Sair da conta</a>`;

    menuDiv.innerHTML = loggedMenu;

    const challengelink = document.querySelector<HTMLAnchorElement>("#challengelink")!;
    const historylink = document.querySelector<HTMLAnchorElement>("#historylink")!;
    const logofflink = document.querySelector<HTMLAnchorElement>("#logofflink")!;

    challengelink.addEventListener("click", pageRender("challenge", menuDiv, siteState));
    historylink.addEventListener("click", pageRender("challenge", menuDiv, siteState));

    logofflink.addEventListener("click", (event) => {
      event.preventDefault();
      siteState.loggedIn = false;
      siteState.jwt = "";
      render();
    });
  } else {
    const loggedMenu = `
<a href="" id="loginlink" class="text-white menu-link" >Entrar</a>
<a href="" id="signuplink" class="text-white menu-link">Cadastrar</a>`;

    menuDiv.innerHTML = loggedMenu;

    const loginlink = document.querySelector<HTMLAnchorElement>("#loginlink")!;
    const signuplink = document.querySelector<HTMLAnchorElement>("#signuplink")!;

    loginlink.addEventListener("click", pageRender("login", menuDiv, siteState));
    signuplink.addEventListener("click", pageRender("signup", menuDiv, siteState));
  }
}

render();
