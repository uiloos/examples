
<template>
  <ModalWrapper v-for="view in modals.views" :key="view.data.id" :view="view" />
</template>

<script lang="ts" setup>
import ModalWrapper from "./ModalWrapper.vue";
import { useViewChannel } from "@uiloos/vue";
import { modalChannel } from "./modal-service";

const modals = useViewChannel(modalChannel);
</script>
