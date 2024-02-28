
<template>
  <ConfirmationDialog
    v-for="view in confirmations.views"
    :key="view.data.id"
    :view="view"
  />
</template>

<script lang="ts" setup>
import ConfirmationDialog from "./ConfirmationDialog.vue";
import { useViewChannel } from "@uiloos/vue";
import { confirmationDialogChannel } from "./confirm-dialog-service";

const confirmations = useViewChannel(confirmationDialogChannel);
</script>
