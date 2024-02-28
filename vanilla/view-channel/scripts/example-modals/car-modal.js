export function carModal(view, modalEl) {
  function onCarClicked(car) {
    view.dismiss(car);
  }

  modalEl.innerHTML = `
    <ol>
      <li>
        <button id="ford">Ford</button>
      </li>
      <li>
        <button id="audi">Audi</button>
      </li>
      <li>
        <button id="toyota">Toyota</button>
      </li>
    </ol>
  `;

  modalEl.querySelectorAll('button').forEach((btn) => {
    btn.onclick = () => onCarClicked(btn.id);
  });
}
