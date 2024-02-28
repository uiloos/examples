<template>
  <button
    class="condiment"
    :class="{ selected: isActive }"
    @click="props.content.toggle()"
  >
    <h4>{{ props.content.value.name }}</h4>
    <p>{{ props.content.value.description }}</p>
    <b>${{ props.content.value.price }}</b>
  </button>
</template>

<script setup lang="ts">
import type { ActiveListContent } from "@uiloos/core";
import type { Condiment as CondimentType } from "./types";

interface Props {
  content: ActiveListContent<CondimentType>;
  isActive: boolean;
}

const props = defineProps<Props>();
</script>

<style>
.condiment {
  width: 200px;
  border: blue 1px solid;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: white;
  cursor: pointer;
}

.condiment p {
  text-align: left;
}

.condiment.selected {
  background-color: lightblue;
}
</style>
