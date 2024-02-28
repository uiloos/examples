<template>
  <span
    v-for="{ time, gridRow } in times"
    class="calendar-week-hour"
    :style="{ 'grid-row': gridRow }"
    aria-hidden
  >
    {{ time }}
  </span>
</template>

<script setup lang="ts">
import { timeFormatter } from "../../../formatters";
import { START_HOUR, END_HOUR } from "../config";

let times: { time: string; gridRow: string }[] = [];

for (let i = START_HOUR; i < END_HOUR + 1; i++) {
  const row = (i - START_HOUR) * 60 + 3;
  const gridRow = `${row} / ${row + 60}`;

  const date = new Date();
  date.setHours(i, 0, 0, 0);

  const time = timeFormatter.format(date);

  times.push({ time, gridRow });
}
</script>

<style scoped>
.calendar-week-hour {
  grid-column: 1 / 9;
  margin-top: -10px; /* Align the hour bar on the grid */
  height: 60px;
  margin-left: 56px;
}

.calendar-week-hour::after {
  display: block;
  content: " ";
  background-color: lightgray;
  height: 1px;
  width: calc(100% - 64px);
  position: relative;
  bottom: 10px;
  left: 64px;
  z-index: -1;
}
</style>
