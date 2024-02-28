<template>
  <li
    ref="eventRef"
    class="calendar-week-event"
    :style="{
      'background-color': event.data.color,
      'grid-column': gridColumn,
      'grid-row': gridRow,
    }"
    @click="
      ($event) => {
        $event.stopPropagation();
        emit('click');
      }
    "
    :draggable="event.spansMultipleDays === false"
    @dragstart="($event) => onDragStart($event)"
    @drag="($event) => onDrag($event)"
  >
    <button
      :style="{
        'background-color': event.data.color,
        color: yiq(event.data.color),
      }"
      :ariaLabel="ariaLabelForEvent(event)"
    >
      <span
        ref="startDragRef"
        class="drag-indicator"
        :draggable="startDraggable"
        @dragstart="($event) => onDragStart($event)"
        @drag="($event) => onDrag($event)"
      ></span>

      <span class="text-container">
        <span class="inner-text-container">
          <b v-if="showStartTime">{{
            timeFormatter.format(event.startDate)
          }}</b>
          <i :title="event.data.title">{{ event.data.title }}</i>
          <span>{{ event.data.description }}</span>
        </span>

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
import type { EventData } from "../../events";
import { ariaLabelForEvent } from "../../events";
import { yiq, getMinutesSinceStart, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";
import { HEIGHT, START_HOUR } from "../config";

interface Props {
  date: Date;
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  gridColumn: string;
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
  yAtDragStart: 0,
  dragStartTime: 0,
  dragEndTime: 0,
  mode: "",
  draggedEvent: props.event,
};

// When the drag starts store information about which event is dragged
function onDragStart(e: DragEvent) {
  e.stopPropagation();

  // Store what the mouse position was at the start of the drag.
  // Used to calulate how many minutes the user wants the event
  // to move.
  dragData.yAtDragStart = e.clientY;

  // Set store the original start and end time for when
  // the dragging began. This way we always know the
  // original times even after we "move" the event.
  dragData.dragStartTime = new Date(props.event.startDate).getTime();
  dragData.dragEndTime = new Date(props.event.endDate).getTime();

  if (e.target === eventRef.value) {
    dragData.mode = "event";
  } else if (e.target === startDragRef.value) {
    dragData.mode = "start";
  } else {
    dragData.mode = "end";
  }

  dragData.draggedEvent = props.event;

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

  // Only do something on drag if we are the event that is
  // being dragged
  if (dragData.draggedEvent !== props.event) {
    return;
  }

  // Sometimes the clientX is suddenly zero on drag end,
  // do nothing if this is the case. Otherwise the event
  // will suddenly jump to the previous day
  if (e.clientX === 0) {
    return;
  }

  // The number of minutes moved is the amount of pixels away
  // the cursor (clientY) is from the clientY at the start of
  // the drag start.
  const minutesMoved = e.clientY - dragData.yAtDragStart;

  // Find the dayEl element the cursor is currently hovering
  // over, if it has found one the date of the event must
  // be changed.
  const hoveredDayEl = document
    .elementsFromPoint(e.clientX, e.clientY)
    .find((element) => {
      return element.classList.contains("calendar-week-day-grid");
    });

  // The user might mouse out of the calendar, in that case default
  // to the current startDate
  let movedToDate = props.event.startDate;
  if (hoveredDayEl && hoveredDayEl instanceof HTMLElement) {
    const date = hoveredDayEl.dataset.date ?? "0";

    movedToDate = new Date(parseInt(date, 10));
  }

  // Move by an increment of 5 minutes, to create a snap effect
  if (
    minutesMoved % 5 === 0 ||
    !props.dateGallery.isSameDay(movedToDate, props.event.startDate)
  ) {
    // Date constructor wants milliseconds since 1970
    const msMoved = minutesMoved * 60 * 1000;

    // Note: moving the event will cause the entire DOM to be ripped
    // to shreds and be rebuilt. So the 5 minute snap effect is
    // also a performance boost.

    if (dragData.mode === "event") {
      const duration = dragData.dragEndTime - dragData.dragStartTime;

      // First update to the new start time
      const startDate = new Date(dragData.dragStartTime + msMoved);

      /* 
        Second update the start date.
        
        We do this via a call to `setFullYear` with all date parts. 
        Setting them in separate calls like this:
        
        startDate.setFullYear(movedToDate.getFullYear());
        startDate.setMonth(movedToDate.getMonth());
        startDate.setDate(movedToDate.getDate());

        Could cause a very nasty bug were it could set the date to a non 
        existing date. But only for very few dates were the size of the 
        month differs from the month the date is moved into.
        
        The bug can be triggered like so:

        const d = new Date(2024, 30, 1); // 1/30/2024 - Feb 30th 2024
        d.setFullYear(2025) // Date is now 1/30/2025
        d.setMonth(2); // Date tries to be 2/30/2025, which doesn't exist, and rolls over to 3/1/2025
        d.setDate(15); // Date is now 3/15/2025 instead of 2/15/2025 as expected

        The above I credit to Marc Hughes see: https://github.com/Simon-Initiative/oli-torus/pull/4614
      */
      startDate.setFullYear(
        movedToDate.getFullYear(),
        movedToDate.getMonth(),
        movedToDate.getDate(),
      );

      // Move both start and end times with the same values
      // so the duration of the event stays the same.
      props.event.move({
        startDate: startDate,
        endDate: new Date(startDate.getTime() + duration),
      });
    } else if (dragData.mode === "start") {
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

let gridRow = ref("");
let showStartTime = ref(false);
let showEndTime = ref(false);

watch(() => props.trigger, sync);
sync();

function sync() {
  /*
    An event that spans multiple days is rendered once in each
    day the event occurs.

    On dates that match the startDate and endDate we make draggable.
  */
  if (props.event.spansMultipleDays) {
    if (props.dateGallery.isSameDay(props.event.startDate, props.date)) {
      // When the event starts on this day, make it span the
      // entire day, as we know it does not end on this day.
      const start = getMinutesSinceStart(props.event.startDate, START_HOUR);
      gridRow.value = `${start + 1} /  ${HEIGHT}`;

      // No end time indicator as it is on another day
      endDraggable.value = false;

      // Show start time only on first day
      showStartTime.value = true;
    } else if (props.dateGallery.isSameDay(props.event.endDate, props.date)) {
      // When the event ends on this day start it at midnight, since
      // we know it started on a previous day.
      const end = getMinutesSinceStart(props.event.endDate, START_HOUR);

      gridRow.value = `1 / ${end + 2}`;

      // No start time drag indicator as it is on another day
      startDraggable.value = false;

      // Show end time only on last day
      showEndTime.value = true;
    } else {
      // When the event is during this whole day take up all space
      gridRow.value = `1 /  ${HEIGHT}`;

      // No start / end drag indicator as it is on another day
      startDraggable.value = false;
      endDraggable.value = false;
    }
  } else {
    // The event is contained within this day.

    const start = getMinutesSinceStart(props.event.startDate, START_HOUR);
    const end = getMinutesSinceStart(props.event.endDate, START_HOUR);

    gridRow.value = `${start + 1} / ${end + 1}`;

    // When fully in this day show both times
    showStartTime.value = true;
    showEndTime.value = true;
  }
}
</script>

<style scoped>
.calendar-week-event {
  opacity: 0.9;
  overflow: hidden;
  text-align: left;
}

.calendar-week-event button {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.calendar-week-event .text-container {
  padding: 0 4px;
  flex-grow: 1;
  overflow: hidden;
  display: grid;
}

.calendar-week-event .text-container .inner-text-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendar-week-event .text-container .end-time {
  align-self: end;
}

.calendar-week-event .drag-indicator {
  width: 100%;
  height: 4px;
}

.calendar-week-event .drag-indicator[draggable="true"] {
  cursor: row-resize;
}
</style>
