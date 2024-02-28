<div class="confirmation-dialog-backdrop" on:click={onCancelClicked}></div>

<div
  class="confirmation-dialog"
  role="dialog"
  aria-label="Please confirm"
  aria-describedby={view.data.text}
>
  <strong>Please confirm</strong>
  <p>{ view.data.text }</p>

  <div class="confirmation-dialog-button-bar">
    <button on:click={onOkClicked}>Ok</button>
    <button on:click={onCancelClicked}>Cancel</button>
  </div>
</div>

<script lang="ts">
import type { ConfirmationData } from "./types";
import type { ViewChannelView } from "@uiloos/core";

export let view: ViewChannelView<ConfirmationData, boolean>;

function onOkClicked() {
  view.dismiss(true);
}

function onCancelClicked() {
  view.dismiss(false);
}
</script>

<style>
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