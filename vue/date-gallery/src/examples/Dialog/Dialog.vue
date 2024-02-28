<template>
  <dialog
    ref="dialog"
    @click="closeDialog($event)"
    @keydown="
      {
        emit('keydown', $event);
      }
    "
  >
    <slot></slot>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

let dialog = ref<HTMLDialogElement | null>(null);

const emit = defineEmits<{
  (e: "keydown", element: KeyboardEvent): void;
  (e: "close"): void;
}>();

onMounted(() => {
  if (dialog.value) {
    dialog.value.showModal();
  }
});

function closeDialog(event: MouseEvent) {
  if (
    event.target instanceof HTMLElement &&
    event.target.nodeName === "DIALOG"
  ) {
    if (dialog.value) {
      dialog.value.close();
      emit("close");
    }
  }
}
</script>
