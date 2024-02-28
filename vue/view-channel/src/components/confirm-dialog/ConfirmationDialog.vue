
<template>
  <div class="confirmation-dialog-backdrop" @click="onCancelClicked()"></div>

  <div
    class="confirmation-dialog"
    role="dialog"
    aria-label="Please confirm"
    :aria-describedby="view.data.text"
  >
    <strong>Please confirm</strong>
    <p>{{ view.data.text }}</p>

    <div class="confirmation-dialog-button-bar">
      <button @click="onOkClicked()">Ok</button>
      <button @click="onCancelClicked()">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ConfirmationData } from "./types";
import { ViewChannelView } from "@uiloos/core";

interface Props {
  view: ViewChannelView<ConfirmationData, boolean>;
}

const { view } = defineProps<Props>();

function onOkClicked() {
  view.dismiss(true);
}

function onCancelClicked() {
  view.dismiss(false);
}
</script>

<style scoped>
.confirmation-dialog-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  background-color: gray;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.confirmation-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  opacity: 1;
  z-index: 3;
}

.confirmation-dialog-button-bar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>