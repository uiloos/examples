<template>
  <p>{{ data.text }}</p>

  <ol>
    <li>
      <button @click="onPokemonClicked('bulbasaur')">Bulbasaur</button>
    </li>
    <li>
      <button @click="onPokemonClicked('squirtle')">Squirtle</button>
    </li>
    <li>
      <button @click="onPokemonClicked('charmander')">Charmander</button>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { ModalComponent } from "../modal/types";
import { ViewChannelView } from "@uiloos/core";
import { confirmDialog } from "../confirm-dialog/confirm-dialog-service";

export type PokemonModalResult = "bulbasaur" | "squirtle" | "charmander";

type PokemonModalComponentData = {
  text: string;
};

interface Props {
  view: ViewChannelView<any, PokemonModalResult>;
  data: PokemonModalComponentData;
}

const { view } = defineProps<Props>();

function onPokemonClicked(pokemon: PokemonModalResult) {
  view.dismiss(pokemon);
}
</script>