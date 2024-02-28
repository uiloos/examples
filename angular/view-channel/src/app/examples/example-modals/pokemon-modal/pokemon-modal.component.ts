import { Component } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ModalComponent, ModalData } from '../../modal/types';

export type PokemonModalResult = 'bulbasaur' | 'squirtle' | 'charmander';

export type PokemonModalComponentData = {
  text: string;
};

@Component({
  selector: 'pokemon-modal',
  templateUrl: './pokemon-modal.component.html',
  standalone: true
})
export class PokemonModalComponent
  implements ModalComponent<PokemonModalResult, PokemonModalComponentData> {
  public view!: ViewChannelView<
    ModalData<PokemonModalComponentData>,
    PokemonModalResult
  >;

  public data!: PokemonModalComponentData;

  onPokemonClicked(pokemon: PokemonModalResult) {
    this.view.dismiss(pokemon);
  }
}
