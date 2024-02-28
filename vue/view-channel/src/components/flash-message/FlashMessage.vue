
<template>
  <div
    :class="['flash-message', 'flash-message-' + view.data.type]"
    :style="{
      'z-index': getZIndex(),
    }"
    @click="view.dismiss()"
    @mouseover="view.pause()"
    @mouseleave="view.play()"
  >
    <div class="flash-message-row">
      <div class="flash-message-content">
        <span class="flash-message-icon">
          {{ getSymbol() }}
        </span>
        <p>{{ view.data.text }}</p>
      </div>
      <span class="flash-message-close">𐄂</span>
    </div>

    <FlashMessageProgressBar
      :duration="view.autoDismiss.duration"
      :type="view.data.type"
      :isPlaying="view.autoDismiss.isPlaying"
    />
  </div>
</template>

<script lang="ts" setup>
import { FlashMessageData } from "./types";
import { ViewChannelView } from "@uiloos/core";
import FlashMessageProgressBar from "./FlashMessageProgressBar.vue";

interface Props {
  view: ViewChannelView<FlashMessageData, void>;
}

const { view } = defineProps<Props>();

function getZIndex() {
  return view.viewChannel.views.length - view.index;
}

function getSymbol(): string {
  switch (view.data.type) {
    case "info":
      return "ⓘ";

    case "warning":
      return "⚠";

    case "error":
      return "☠";

    case "success":
      return "✓";
  }

  return "";
}
</script>

<style scoped>
.flash-messages {
  position: fixed;
  width: 100%;
  /* Place the flash messages below the button */
  top: 200px;
}

.flash-messages-container {
  display: grid;
  gap: 16px;
  padding: 0 10px;
}

.flash-message {
  will-change: transform, opacity;

  padding: 8px;

  font-size: 22px;

  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-family: sans-serif;
}

.flash-message-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flash-message-info {
  color: white;
  background-color: #3b82f6;
}

.flash-message-warning {
  color: white;
  background-color: #eab308;
}

.flash-message-error {
  color: white;
  background-color: #ef4444;
}

.flash-message-success {
  color: white;
  background-color: #22c55e;
}

.flash-message-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flash-message-icon {
  font-size: 38px;
}

.flash-message-close {
  font-size: 32px;
  margin-right: 32px;
  margin-top: -5px;
}
</style>