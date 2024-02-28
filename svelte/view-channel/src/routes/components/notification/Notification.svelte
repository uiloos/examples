<div class="notification">
  { view.data.text }

  <div class="notification-buttons">
    <button on:click={onClearClicked} class="notification-button">
      Clear
    </button>

    {#each view.data.buttons as btn}
      <button
        on:click={(event) => btn.onClick(event, view)}
        class="notification-button"
      >
        { btn.label }
      </button>
    {/each}
  </div>
</div>

<script lang="ts">
import type { ViewChannelView } from "@uiloos/core";
import type { NotificationData } from "./types";

export let view: ViewChannelView<NotificationData, undefined>;

function onClearClicked() {
  view.dismiss(undefined);
}
</script>

<style>
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