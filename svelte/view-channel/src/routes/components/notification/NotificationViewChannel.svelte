
<div class="notifications">
  {#if $notifications.views.length}
    <div>
      <button on:click={dismissAll}>Clear all</button>
    </div>
  {:else}
    <p>No notifications yet</p>
  {/if}

  <div role="status" aria-live="polite">
    {#each $notifications.views as view}
      <Notification view={view} />
    {/each}
  </div>
</div>

<script lang="ts">
import Notification from "./Notification.svelte";
import { createViewChannelStore } from "@uiloos/svelte";
import { notificationChannel } from "./notification-service";

// Via createViewChannelStore we make sure this component re-renders
// whenever the ViewChannel changes.
const notifications = createViewChannelStore(notificationChannel);

function dismissAll() {
  $notifications.dismissAll(undefined);
}
</script>

<style>
.notifications {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
}
</style>
