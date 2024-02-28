

<template>
  <div class="notification">
    {{ view.data.text }}

    <div class="notification-buttons">
      <button @click="onClearClicked()" class="notification-button">
        Clear
      </button>

      <button
        v-for="btn of view.data.buttons"
        :key="btn.label"
        @click="($event) => btn.onClick($event, view)"
        class="notification-button"
      >
        {{ btn.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewChannelView } from "@uiloos/core";
import { NotificationData } from "./types";

interface Props {
  view: ViewChannelView<NotificationData, undefined>;
}

const { view } = defineProps<Props>();

function onClearClicked() {
  view.dismiss(undefined);
}
</script>

<style scoped>
.notification {
  border: 1px solid darkslategrey;
  padding: 8px 2px;
  height: 42px;
  display: flex;
  flex-direction: column;
}

.notification-buttons {
  align-self: flex-end;
}
</style>