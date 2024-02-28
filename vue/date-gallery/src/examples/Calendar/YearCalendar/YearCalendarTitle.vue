<template>
  {{ yearFormatter.format(anchorDate) }}
</template>

<script setup lang="ts">
import { yearFormatter } from "../../formatters";

interface Props {
  anchorDate: Date;
}

defineProps<Props>();
</script>
