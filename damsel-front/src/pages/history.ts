import type { GlobalState } from "../types/states";

export function historyPage(siteState: GlobalState) {
  const menuDiv = siteState.menuDiv!;

  return (event: MouseEvent) => {
    event.preventDefault();
    menuDiv.innerHTML = 'olá';
  };
}