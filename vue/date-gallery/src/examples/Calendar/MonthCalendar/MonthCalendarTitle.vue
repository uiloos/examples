<template>
  {{ monthAndYearFormatter.format(anchorDate) }}
</template>

<script setup lang="ts">
import { monthAndYearFormatter } from "../../formatters";

interface Props {
  anchorDate: Date;
}

defineProps<Props>();
</script>
