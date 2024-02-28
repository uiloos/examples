import { renderModal } from "./utils.js";

export function pokemonModal(args) {
  renderModal({
    args,
    template: `
      <p x-text="data.text"></p>

      <ol>
        <li>
          <button @click="view.dismiss('bulbasaur')">
            Bulbasaur
          </button>
        </li>
        <li>
          <button @click="view.dismiss('squirtle')">Squirtle</button">
        </li>
        <li>
          <button @click="view.dismiss('charmander')">
            Charmander
          </button>
        </li>
      </ol>
    `
  });
}
