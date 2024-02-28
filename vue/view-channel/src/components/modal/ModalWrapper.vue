<template>
  <div class="modal-backdrop" @click="onCancelClicked()"></div>

  <div
    class="modal"
    role="dialog"
    :aria-label="view.data.info.title"
    aria-describedby="modal-description"
  >
    <button
      class="modal-close"
      @click="onCancelClicked()"
      aria-label="Close modal"
    >
      ✖
    </button>

    <h1>{{ view.data.info.title }}</h1>

    <p id="modal-description">{{ view.data.info.description }}</p>

    <component :is="view.data.component" :view="view" :data="view.data.data" />
  </div>
</template>

<script lang="ts" setup>
import { modalCancelled } from "./modal-service";
import { onMounted, onUnmounted } from "vue";
import { ModalData } from "./types";
import { ViewChannelView } from "@uiloos/core";

interface Props {
  view: ViewChannelView<ModalData<any>, any>;
}

const { view } = defineProps<Props>();

function onCancelClicked() {
  view.dismiss(modalCancelled);
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    onCancelClicked();
  }
}

onMounted(() => {
  document.addEventListener("keydown", closeOnEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
});
</script>``

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  background-color: gray;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  opacity: 1;
  z-index: 2;
}

.modal-close {
  float: right;
}
</style>