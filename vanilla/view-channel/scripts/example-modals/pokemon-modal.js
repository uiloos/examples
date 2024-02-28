export function pokemonModal(view, modalEl, data) {
  function onPokemonClicked(pokemon) {
    view.dismiss(pokemon);
  }

  modalEl.innerHTML = `
    <p>${data.text}</p>

    <ol>
      <li>
        <button id="bulbasaur">
          Bulbasaur
        </button>
      </li>
      <li>
        <button id="squirtle">Squirtle</button">
      </li>
      <li>
        <button id="charmander">
          Charmander
        </button>
      </li>
    </ol>
  `;

  modalEl.querySelectorAll('button').forEach((btn) => {
    btn.onclick = () => onPokemonClicked(btn.id);
  });
}
