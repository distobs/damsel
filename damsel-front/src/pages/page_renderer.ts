import { render } from "../main";
import type { GlobalState } from "../types/states";
import { challengePage } from "./challenge";
import { historyPage } from "./history";
import { loginPage } from "./login";
import { signupPage } from "./signup";

export function pageRender(page: string, siteState: GlobalState) {
  return (event: PointerEvent) => {
    const titleDiv = document.querySelector("#titlediv")!;

    titleDiv.innerHTML = `<a id="goback" class="text-white mb-0" href=""><</a>` + titleDiv.innerHTML;

    const goback = document.querySelector<HTMLAnchorElement>("#goback")!;

    goback.addEventListener("click", (event) => {
      event.preventDefault();
      render();
    });

    switch (page) {
      case "challenge":
        return challengePage(siteState)(event);
      case "history":
        return historyPage(siteState)(event);
      case "login":
        return loginPage(siteState)(event);
      case "signup":
        return signupPage(siteState)(event);
    }
  }
}
