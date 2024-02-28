<div class="modal-backdrop" on:click={onCancelClicked}></div>

<div
  class="modal"
  role="dialog"
  aria-label={view.data.info.title}
  aria-describedby="modal-description"
>
  <button
    class="modal-close"
    on:click={onCancelClicked}
    aria-label="Close modal"
  >
    ✖
  </button>

  <h1>{ view.data.info.title }</h1>

  <p id="modal-description">{ view.data.info.description }</p>

  <svelte:component this={view.data.component} view={view} data={view.data.data} />
</div>

<script lang="ts">
import { onMount } from 'svelte';
import { modalCancelled } from "./modal-service";
import type { ModalData, ModalComponent } from "./types";
import type { ViewChannelView } from "@uiloos/core";

export let view: ViewChannelView<ModalData<unknown, unknown>, any>;

function onCancelClicked() {
  view.dismiss(modalCancelled);
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") {
    onCancelClicked();
  }
}

onMount(() => {
  document.addEventListener("keydown", closeOnEscape);

  return () => {
    document.removeEventListener("keydown", closeOnEscape);
  }
});

</script>

<style>
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