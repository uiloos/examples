import { confirmDialog } from '/scripts/confirm-dialog.js';

export function planetModal(view, modalEl, data) {
  async function destroy(planet) {
    const confirmation = await confirmDialog(
      `Are you sure you want to destroy ${planet}`
    );

    if (confirmation) {
      view.dismiss(planet);
    }
  }

  modalEl.innerHTML = `
    <small>${data.plea}</small>

    <ol>
      <li>
        <button id="earth">Earth</button>
      </li>
      <li>
        <button id="mars">Mars</button>
      </li>
      <li>
        <button id="venus">Venus</button>
      </li>
    </ol>
  `;

  modalEl.querySelectorAll('button').forEach((btn) => {
    btn.onclick = () => destroy(btn.id);
  });
}
