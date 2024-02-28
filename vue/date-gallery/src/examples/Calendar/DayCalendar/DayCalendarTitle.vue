<template>
  {{ dateFormatter.format(anchorDate) }}
</template>

<script setup lang="ts">
import { dateFormatter } from "../../formatters";

interface Props {
  anchorDate: Date;
}

defineProps<Props>();
</script>
