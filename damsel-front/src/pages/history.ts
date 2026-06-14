export function historyPage(menuDiv: HTMLDivElement) {
  return (event: MouseEvent) => {
    event.preventDefault();
    menuDiv.innerHTML = 'olá';
  };
}