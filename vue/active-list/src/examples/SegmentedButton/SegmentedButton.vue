<template>
  <div class="segment-container">
    <button
      v-for="content in segmentedButtons.contents"
      :key="content.value.label"
      @click="activate($event, content)"
      :class="{ active: content.isActive }"
    >
      {{ content.value.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ActiveListContent } from "@uiloos/core";
import { useActiveList } from "@uiloos/vue";
import type { SegmentedButtonItem } from "./types.ts";

interface Props {
  buttons: SegmentedButtonItem[];
}

const props = defineProps<Props>();

const segmentedButtons = useActiveList({
  contents: props.buttons,
  active: props.buttons.find((button) => button.active),
});

function activate(
  event: MouseEvent,
  content: ActiveListContent<SegmentedButtonItem>,
) {
  content.activate();
  content.value.onClick(event);
}
</script>

<style>
.segment-container {
  display: flex;
  justify-content: center;
}

.segment-container button {
  color: black;
  padding: 8px;
  font-size: 1.2rem;
}

.segment-container button.active,
.segment-container button:hover {
  color: white;
  background-color: black;
}
</style>
