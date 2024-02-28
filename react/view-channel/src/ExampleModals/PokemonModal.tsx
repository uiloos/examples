import { ModalComponentProps } from '../Modal/types';

type Props = {
  text: string;
};

type PokemonModalResult = 'bulbasaur' | 'squirtle' | 'charmander';

export function PokemonModal(
  props: ModalComponentProps<Props, PokemonModalResult>
) {
  function onPokemonClicked(pokemon: PokemonModalResult) {
    props.view.dismiss(pokemon);
  }

  return (
    <>
      <p>{props.text}</p>

      <ol>
        <li>
          <button onClick={() => onPokemonClicked('bulbasaur')}>
            Bulbasaur
          </button>
        </li>
        <li>
          <button onClick={() => onPokemonClicked('squirtle')}>Squirtle</button>
        </li>
        <li>
          <button onClick={() => onPokemonClicked('charmander')}>
            Charmander
          </button>
        </li>
      </ol>
    </>
  );
}
