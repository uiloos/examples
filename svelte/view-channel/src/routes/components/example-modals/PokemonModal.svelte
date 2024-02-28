<p>{ data.text }</p>

<ol>
  <li>
    <button on:click={() => onPokemonClicked('bulbasaur')}>Bulbasaur</button>
  </li>
  <li>
    <button on:click={() => onPokemonClicked('squirtle')}>Squirtle</button>
  </li>
  <li>
    <button on:click={() => onPokemonClicked('charmander')}>Charmander</button>
  </li>
</ol>

<script lang="ts">
import type { ModalComponent } from "../modal/types";
import type { ViewChannelView } from "@uiloos/core";
import { confirmDialog } from "../confirm-dialog/confirm-dialog-service";

type PokemonModalComponentData = {
  text: string;
};

export let view: ViewChannelView<unknown, PokemonModalResult>;
export let data: PokemonModalComponentData;

function onPokemonClicked(pokemon: PokemonModalResult) {
  view.dismiss(pokemon);
}

</script>

<script context="module" lang="ts">
export type PokemonModalResult = "bulbasaur" | "squirtle" | "charmander";
</script>