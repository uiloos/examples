<template>
  <select :value="month" @change="onMonthChanged($event)">
    <option v-for="month in [...Array(12).keys()]" :value="month">
      {{ monthFormatter.format(new Date(2000, month, 1)) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { DateGallery } from "@uiloos/core";
import { monthFormatter } from "../formatters";

interface Props {
  dateGallery: DateGallery<unknown>;
  month: number;
}

const props = defineProps<Props>();

function onMonthChanged(e: Event) {
  if (e.target instanceof HTMLSelectElement) {
    const newMonth = parseInt(e.target.value, 10);

    const date = new Date(props.dateGallery.firstFrame.anchorDate);
    date.setMonth(newMonth);

    props.dateGallery.changeConfig({ initialDate: date });
  }
}
</script>

<style scoped>
select {
  font-size: 16px;
}
</style>
