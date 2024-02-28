<template>
  <ul class="calendar-day-grid" :style="{ '--width': WIDTH }">
    <HourIndicators
      :dateGallery="dateGallery"
      @open-new-event-form="(date: Date) => emit('openNewEventForm', date)"
      :rows="rows"
      :trigger="trigger"
    />

    <CurrentHour :dateGallery="dateGallery" :rows="rows" :trigger="trigger" />

    <DayEvent
      v-for="event in dateGallery.firstFrame.events"
      :key="event.data.id"
      :event="event"
      :dateGallery="dateGallery"
      :gridRow="eventRows.get(event) ?? ''"
      @click="() => emit('openEditEventForm', event)"
      :trigger="trigger"
    />
  </ul>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import { packEventsOnAxis } from "../events";
import type { EventData } from "../events";
import CurrentHour from "./components/CurrentHour.vue";
import DayEvent from "./components/DayEvent.vue";
import HourIndicators from "./components/HourIndicators.vue";
import { WIDTH } from "./config";

interface Props {
  dateGallery: DateGallery<EventData>;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "openNewEventForm", date: Date): void;
  (e: "openEditEventForm", event: DateGalleryEvent<EventData>): void;
}>();

let eventRows = ref(calculateEventRows(props.dateGallery));
let rows = ref(getNoRows(eventRows.value));

watch(() => props.trigger, sync);
function sync() {
  eventRows.value = calculateEventRows(props.dateGallery);
  rows.value = getNoRows(eventRows.value);
}

/* 
  Takes a DateGallery and returns a Map to which the events 
  are keys, and the values are CSS gridRow strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of rows are used.
*/
function calculateEventRows(
  dateGallery: DateGallery<EventData>,
): Map<DateGalleryEvent<EventData>, string> {
  // Step one: we place all events into the least amount of rows
  const rows = packEventsOnAxis(dateGallery.events);

  // Step two: we take the rows array and turn it into a Map of CSS
  // grid row strings.
  const eventRows = new Map<DateGalleryEvent<EventData>, string>();

  dateGallery.events.forEach((event) => {
    const row = rows.findIndex((row) => row.includes(event));

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the rows. Also we now that the first
    // row shows the hours so another +1 is needed.
    eventRows.set(event, `${row + 2}`);
  });

  return eventRows;
}

function getNoRows(eventRows: Map<DateGalleryEvent<EventData>, string>) {
  let noRows = 0;

  eventRows.forEach((rowStr) => {
    noRows = Math.max(parseInt(rowStr, 10), noRows);
  });

  return noRows < 20 ? 20 : noRows;
}
</script>

<style scoped>
.calendar-day-grid {
  /* Is set from within JavaScript based on the visible hours */
  --width: 0;

  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(var(--width), minmax(1px, 1fr));
  grid-template-rows: repeat(20, 30px);
  row-gap: 8px;
}
</style>
