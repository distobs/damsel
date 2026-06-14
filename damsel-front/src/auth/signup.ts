import { render } from "../main";
import type { GlobalState } from "../types/states";

export function signupAuth(form: HTMLFormElement) {
  return async (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(form);

    const login = data.get("login");
    const password = data.get("senha");

    if (!login || !password) {
      alert("Login vaziou ou senha vazia.");
      return;
    }

    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password })
    });

    if (response.status != 200) {
      alert("Erro ao criar usuário");
      return;
    } else {
      render();
      return;
    }
  };
}
