import { renderModal } from "./utils.js";

export function planetModal(args) {
  renderModal({
    args,
    template: `
      <p x-text="data.text"></p>

      <ol>
        <li>
          <button @click="actions.destroy('earth')">
            Earth
          </button>
        </li>
        <li>
          <button @click="actions.destroy('venus')">
            Venus
          </button>
        </li>
        <li>
          <button @click="actions.destroy('mars')">
            Mars
          </button>
        </li>
      </ol>
    `,
    actions: {
      async destroy(planet) {
        const confirmationDialog = Alpine.store("confirmationDialogs");

        const confirmation = await confirmationDialog.confirmDialog(
          `Are you sure you want to destroy ${planet}`
        );

        if (confirmation) {
          args.modal.dismiss(planet);
        }
      }
    }
  });
}
