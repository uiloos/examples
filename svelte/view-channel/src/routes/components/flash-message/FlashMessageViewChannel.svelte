<div role="status" aria-live="polite">
  {#each $flashMessages.views as view}
    <FlashMessage view={view} />
  {/each}
</div>

<script lang="ts">
import FlashMessage from "./FlashMessage.svelte";
import { createViewChannelStore } from "@uiloos/svelte";
import { flashMessageChannel } from "./flash-message-service";

const flashMessages = createViewChannelStore(flashMessageChannel);
</script>
