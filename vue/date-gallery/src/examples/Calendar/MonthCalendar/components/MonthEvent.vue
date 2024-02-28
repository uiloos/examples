<template>
  <li
    class="calendar-month-event"
    :class="{
      multiple: event.spansMultipleDays,
      'first-day-of-event':
        event.spansMultipleDays &&
        dateGallery.isSameDay(event.startDate, dateObj.date),
    }"
    :style="{
      gridRow: gridRow,
      'background-color': event.spansMultipleDays
        ? event.data.color
        : undefined,
      '--color': event.data.color,
    }"
    draggable="true"
    @dragstart="($event) => onDragStart($event)"
    @click="
      ($event) => {
        $event.stopPropagation();
        emit('click');
      }
    "
  >
    <button
      class="calendar-month-event-wrapper"
      :style="{
        color: event.spansMultipleDays ? yiq(event.data.color) : undefined,
      }"
      :aria-label="ariaLabelForEvent(event)"
    >
      <span class="calendar-month-event-title">{{ title }}</span>
      <span class="calendar-month-event-time">{{ time }}</span>
    </button>
  </li>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { DateGallery, DateGalleryEvent, DateGalleryDate } from "@uiloos/core";
import { ariaLabelForEvent } from "../../events";
import type { EventData } from "../../events";
import { yiq, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";

interface Props {
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  dateObj: DateGalleryDate<EventData>;
  gridRow: number;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "click"): void;
  (e: "drag", event: DateGalleryEvent<EventData>): void;
}>();

let title = ref("");
let time = ref("");

watch(() => props.trigger, sync);
sync();

function sync() {
  if (props.event.spansMultipleDays) {
    /*
        An event that spans multiple days is rendered once in each
        day the event occurs.

        On the startDate we render the title and start time, on the
        endDate we render the end time. For all days in between we
        only give it a background color.
    */
    if (
      props.dateGallery.isSameDay(props.event.startDate, props.dateObj.date)
    ) {
      title.value = props.event.data.title;
      time.value = timeFormatter.format(props.event.startDate);
    } else if (
      props.dateGallery.isSameDay(props.event.endDate, props.dateObj.date)
    ) {
      time.value = timeFormatter.format(props.event.endDate);
    }
  } else {
    // When an event happens on a single day show the title and start time.
    title.value = props.event.data.title;
    time.value = timeFormatter.format(props.event.startDate);
  }
}

function onDragStart(e: DragEvent) {
  e.stopPropagation();

  emit("drag", props.event);

  // Set the drag image to an empty image. Because we are
  // going to continuously "move" the event we do not need
  // a "ghost".
  if (e.dataTransfer) {
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  }
}
</script>

<style scoped>
.calendar-month-event {
  --color: #000000; /* color is set from js */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  background-color: white;
  font-size: 16px;
  min-height: 32px;
}

.calendar-month-event::before {
  content: "";
  border-radius: 25px;
  background-color: var(--color);
  width: 10px;
  height: 10px;
  margin-left: 4px;
}

.calendar-month-event.multiple {
  margin-left: -1px;
}

.calendar-month-event.first-day-of-event {
  border-left: 1px solid black;
}

.calendar-month-event.multiple::before {
  display: none;
}

.calendar-month-event-wrapper {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  background-color: transparent;
  padding: 0 4px;
}

.calendar-month-event-title {
  width: 75px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}

.calendar-month-event-more {
  margin-top: 4px;
  font-size: 16px;
  text-align: right;
}
</style>
