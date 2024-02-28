import { renderModal } from "./utils.js";

export function carModal(args) {
  renderModal({
    args,
    template: `
      <ol>
        <li>
          <button @click="view.dismiss('ford')">Ford</button>
        </li>
        <li>
          <button @click="view.dismiss('audi')">Audi</button>
        </li>
        <li>
          <button @click="view.dismiss('toyota')">Toyota</button>
        </li>
      </ol>
    `
  });
}
