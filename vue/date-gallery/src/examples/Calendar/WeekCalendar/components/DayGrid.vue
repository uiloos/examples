<template>
  <ul
    :data-date="date.getTime()"
    class="calendar-week-day-grid"
    :style="{ 'grid-column': gridColumn }"
    @click="($event) => onClick($event)"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { START_HOUR } from "../config";

interface Props {
  date: Date;
  gridColumn: number;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "openNewEventForm", date: Date): void;
}>();

function onClick(event: MouseEvent) {
  if (event.target instanceof HTMLElement) {
    // To determine the minute we look to where the user
    // clicked in the day cell. Remember: the day cell
    // is 1440 in height, one pixel per minute.

    const rect = event.target.getBoundingClientRect();
    const distanceInMinutes = event.clientY - rect.top;

    let hour = Math.floor(distanceInMinutes / 60);
    hour += START_HOUR;

    let minute = Math.round(distanceInMinutes % 60);
    // Round to closest 5 minutes
    minute = Math.round(minute / 5) * 5;

    const startDate = new Date(props.date);
    startDate.setHours(hour, minute);
    emit("openNewEventForm", startDate);
  }
}
</script>

<style scoped>
.calendar-week-day-grid {
  grid-row: 2 / var(--height);
  display: grid;
  grid-template-rows: repeat(var(--height), 1px);
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  border-right: 1px solid black;
  column-gap: 8px;
  padding: 0 4px;
  cursor: pointer;
  list-style-type: none;
}
</style>
