<template>
  <li
    ref="eventRef"
    :draggable="event.spansMultipleDays === false"
    @dragstart="($event) => onDragStart($event)"
    @drag="($event) => onDrag($event)"
    class="calendar-day-event"
    :style="{
      'background-color': event.data.color,
      'grid-row': gridRow,
      'grid-column': gridColumn,
    }"
  >
    <button
      :style="{
        'background-color': event.data.color,
        color: yiq(event.data.color),
      }"
      :ariaLabel="ariaLabelForEvent(event)"
      @click="
        ($event) => {
          $event.stopPropagation();
          emit('click');
        }
      "
    >
      <span
        ref="startDragRef"
        class="drag-indicator"
        :draggable="startDraggable"
        @dragstart="($event) => onDragStart($event)"
        @drag="($event) => onDrag($event)"
      ></span>

      <span class="text-container">
        <b v-if="showStartTime">{{ timeFormatter.format(event.startDate) }}</b>

        <i :title="event.data.title">{{ event.data.title }}</i>

        <b v-if="showEndTime" class="end-time">{{
          timeFormatter.format(event.endDate)
        }}</b>
      </span>

      <span
        ref="endDragRef"
        class="drag-indicator"
        :draggable="endDraggable"
        @dragstart="($event) => onDragStart($event)"
        @drag="($event) => onDrag($event)"
      ></span>
    </button>
  </li>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import { ariaLabelForEvent } from "../../events";
import type { EventData } from "../../events";
import { yiq, getMinutesSinceStart, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";
import { WIDTH, START_HOUR } from "../config";

interface Props {
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  gridRow: string;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

let eventRef = ref<HTMLLinkElement | null>(null);
let startDragRef = ref<HTMLSpanElement | null>(null);
let endDragRef = ref<HTMLSpanElement | null>(null);

let startDraggable = ref(true);
let endDraggable = ref(true);

let dragData = {
  xAtDragStart: 0,
  dragStartTime: 0,
  dragEndTime: 0,
};

// When the drag starts store information about which event is dragged
function onDragStart(e: DragEvent) {
  e.stopPropagation();

  // Store what the mouse position was at the start of the drag.
  // Used to calulate how many minutes the user wants the event
  // to move.
  dragData.xAtDragStart = e.clientX;

  // Set store the original start and end time for when
  // the dragging began. This way we always know the
  // original times even after we "move" the event.
  dragData.dragStartTime = new Date(props.event.startDate).getTime();
  dragData.dragEndTime = new Date(props.event.endDate).getTime();

  // Set the drag image to an empty image. Because we are
  // going to continuously "move" the event we do not need
  // a "ghost".
  if (e.dataTransfer) {
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  }
}

// When the the event is dragged alter the time period of the vent.
function onDrag(e: DragEvent) {
  e.stopPropagation();

  // Sometimes the clientX is suddenly zero on drag end,
  // do nothing if this is the case. Otherwise the event
  // will suddenly jump to the previous day
  if (e.clientX === 0) {
    return;
  }

  // The number of minutes moved is the amount of pixels away
  // the cursor (clientX) is from the clientX at the start of
  // the drag start.
  const minutesMoved = e.clientX - dragData.xAtDragStart;

  // Move by an increment of 5 minutes, to create a snap effect
  if (minutesMoved % 5 === 0) {
    // Date constructor wants milliseconds since 1970
    const msMoved = minutesMoved * 60 * 1000;

    // Note: moving the event will cause the entire DOM to be ripped
    // to shreds and be rebuilt. So the 5 minute snap effect is
    // also a performance boost.

    if (e.target === eventRef.value) {
      // Move both start and end times with the same values
      // so the duration of the event stays the same.
      props.event.move({
        startDate: new Date(dragData.dragStartTime + msMoved),
        endDate: new Date(dragData.dragEndTime + msMoved),
      });
    } else if (e.target === startDragRef.value) {
      // Move only the start time
      props.event.move({
        startDate: new Date(dragData.dragStartTime + msMoved),
        endDate: props.event.endDate,
      });
    } else {
      // Move only the end time
      props.event.move({
        startDate: props.event.startDate,
        endDate: new Date(dragData.dragEndTime + msMoved),
      });
    }
  }
}

let gridColumn = ref("");
let showStartTime = ref(false);
let showEndTime = ref(false);

watch(() => props.trigger, sync);
sync();

function sync() {
  const dayDate = props.dateGallery.firstFrame.anchorDate;

  if (props.event.spansMultipleDays) {
    if (props.dateGallery.isSameDay(props.event.startDate, dayDate)) {
      // When the event starts on this day, make it span the
      // entire day, as we know it does not end on this day.
      const start = getMinutesSinceStart(props.event.startDate, START_HOUR);
      gridColumn.value = `${start + 1} / ${WIDTH}`;

      // No end time indicator as it is on another day
      endDraggable.value = false;

      // Show start time only on first day
      showStartTime.value = true;
    } else if (props.dateGallery.isSameDay(props.event.endDate, dayDate)) {
      // When the event ends on this day start it at midnight, since
      // we know it started on a previous day.
      const end = getMinutesSinceStart(props.event.endDate, START_HOUR);
      gridColumn.value = `1 / ${end + 2}`;

      // No start time drag indicator as it is on another day
      startDraggable.value = false;

      // Show end time only on last day
      showEndTime.value = true;
    } else {
      // When the event is during this whole day
      gridColumn.value = `1 / ${WIDTH}`;

      // No start / end drag indicator as it is on another day
      startDraggable.value = false;
      endDraggable.value = false;
    }
  } else {
    // The event is contained within this day.

    const start = getMinutesSinceStart(props.event.startDate, START_HOUR);
    const end = getMinutesSinceStart(props.event.endDate, START_HOUR);

    gridColumn.value = `${start + 1} / ${end + 1}`;

    // When fully in this day show both times
    showStartTime.value = true;
    showEndTime.value = true;
  }
}
</script>

<style scoped>
.calendar-day-event {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
  height: 30px;
  overflow: hidden;
  cursor: pointer;
  z-index: 1;
}

.calendar-day-event button {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

.calendar-day-event .text-container {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  display: flex;
  gap: 4px;
}

.calendar-day-event .end-time {
  flex-grow: 1;
  text-align: right;
}

.calendar-day-event .drag-indicator {
  width: 4px;
  height: 30px;
}

.calendar-day-event .drag-indicator[draggable="true"] {
  cursor: col-resize;
}
</style>
