<template>
  <small>{{ data.plea }}</small>

  <ol>
    <li>
      <button @click="destroy('earth')">Earth</button>
    </li>
    <li>
      <button @click="destroy('mars')">Mars</button>
    </li>
    <li>
      <button @click="destroy('venus')">Venus</button>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { ViewChannelView } from "@uiloos/core";
import { confirmDialog } from "../confirm-dialog/confirm-dialog-service";

type PlanetModalResult = "earth" | "mars" | "venus";

type PlanetModalComponentData = {
  plea: string;
};

interface Props {
  view: ViewChannelView<any, PlanetModalResult>;
  data: PlanetModalComponentData;
}

const { view } = defineProps<Props>();

async function destroy(planet: PlanetModalResult) {
  const confirmation = await confirmDialog(
    `Are you sure you want to destroy ${planet}`
  );

  if (confirmation) {
    view.dismiss(planet);
  }
}
</script>