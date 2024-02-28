<template>
  <ol>
    <li>
      <button @click="onCarClicked('ford')">Ford</button>
    </li>
    <li>
      <button @click="onCarClicked('audi')">Audi</button>
    </li>
    <li>
      <button @click="onCarClicked('toyota')">Toyota</button>
    </li>
  </ol>
</template>

<script lang="ts" setup>
import { ViewChannelView } from "@uiloos/core";

type CarModalResult = "ford" | "audi" | "toyota";

interface Props {
  view: ViewChannelView<any, CarModalResult>;
  data: {};
}

const { view } = defineProps<Props>();

function onCarClicked(car: CarModalResult) {
  view.dismiss(car);
}
</script>