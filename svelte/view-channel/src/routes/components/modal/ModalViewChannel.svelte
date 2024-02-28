
{#each $modals.views as view}
  <ModalWrapper view={view} />
{/each}

<script lang="ts">
import ModalWrapper from "./ModalWrapper.svelte";
import { createViewChannelStore } from "@uiloos/svelte";
import { modalChannel } from "./modal-service";

const modals = createViewChannelStore(modalChannel);
</script>
