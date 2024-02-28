{#each $confirmations.views as view }
  <ConfirmationDialog view={view} />
{/each}


<script lang="ts">
import ConfirmationDialog from "./ConfirmationDialog.svelte";
import { createViewChannelStore } from "@uiloos/svelte";
import { confirmationDialogChannel } from "./confirm-dialog-service";

const confirmations = createViewChannelStore(confirmationDialogChannel);
</script>
