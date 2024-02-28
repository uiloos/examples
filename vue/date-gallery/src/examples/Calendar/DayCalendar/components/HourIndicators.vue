<template>
  <li
    v-for="{ column, time, date } in times"
    class="calendar-day-hour"
    aria-hidden
    :style="{
      'grid-column': `${column} / ${column + 60}`,
      'grid-row': `1 / ${rows}`,
    }"
    @click="($event) => onClick($event, date)"
  >
    {{ time }}
  </li>
</template>

<script setup lang="ts">
import { DateGallery } from "@uiloos/core";
import { timeFormatter } from "../../../formatters";
import type { EventData } from "../../events";
import { START_HOUR, END_HOUR } from "../config";

interface Props {
  dateGallery: DateGallery<EventData>;
  rows: number;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "openNewEventForm", date: Date): void;
}>();

let times: { time: string; column: number; date: Date }[] = [];

for (let i = START_HOUR; i < END_HOUR + 1; i++) {
  const column = (i - START_HOUR) * 60 + 1;

  const date = new Date(props.dateGallery.firstFrame.anchorDate);
  date.setHours(i, 0, 0, 0);

  const time = timeFormatter.format(date);

  times.push({ time, column, date });
}

function onClick(event: MouseEvent, date: Date) {
  if (event.target instanceof HTMLElement) {
    // To determine the minute we look to where the user
    // clicked in the hour cell. Remember: the hour cell
    // is 60px in height, one pixel per minute.
    const rect = event.target.getBoundingClientRect();
    const distanceInMinutes = event.clientX - rect.left;

    // Round to closest 5 minutes
    const minute = Math.round(distanceInMinutes / 5) * 5;

    const eventDate = new Date(date);
    eventDate.setHours(date.getHours(), minute);

    emit("openNewEventForm", eventDate);
  }
}
</script>

<style scoped>
.calendar-day-hour {
  display: flex;
  margin-left: -1px;
  padding-left: 4px;
  border-left: solid lightgray 1px;
  cursor: pointer;
  background-color: white;
  font-size: 16px;
}
</style>
