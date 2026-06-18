import { sck_connect } from "../gameserver/socket";
import { render } from "../main";
import type { GlobalState } from "../types/states";

export function loginAuth(siteState: GlobalState, form: HTMLFormElement) {
  return async (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(form);

    const login = data.get("login");
    const password = data.get("senha");

    if (!login || !password) {
      alert("Login vazio ou senha vazia.");
      return;
    }

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password })
    });

    if (response.status != 200) {
      const res = await response.json();
      const sres = JSON.stringify(res);
      alert(`Erro ao efetuar login: ${sres}`);
      return;
    } else {
      const jres = await response.json()

      const token = jres.message;

      siteState.loggedIn = true;
      siteState.jwt = token;
      siteState.socket = sck_connect(siteState.jwt);

      siteState.socket!.addEventListener("message", (ev) => {
        if (ev.data === "CHAL") {
          alert("tu vai aceitar sim baitola");
          siteState.socket!.send("ACPT");
        }
      });

      render();
    }
  };
};
