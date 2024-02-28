<li
  bind:this={eventRef}
  
  draggable={event.spansMultipleDays === false}
  on:dragstart={onDragStart}
  on:drag={onDrag}
  
  class="calendar-day-event"
  
  style:background-color={event.data.color}
  style:grid-row={gridRow}
  style:grid-column={gridColumn}
>
  <button
    aria-label={ariaLabelForEvent(event)}
    style:background-color={event.data.color}
    style:color={yiq(event.data.color)}
    on:click={onClick}
  >
    <span 
      bind:this={startDragRef}
      class="drag-indicator"
      draggable={startDraggable}
      on:dragstart={onDragStart}
      on:drag={onDrag}
    ></span>

    <span class="text-container">
      {#if showStartTime}
        <b>{timeFormatter.format(event.startDate)}</b>
      {/if}

      <i title={event.data.title}>{event.data.title}</i>

      {#if showEndTime}
        <b class="end-time">{timeFormatter.format(event.endDate)}</b>
      {/if}
    </span>
      
    <span 
      bind:this={endDragRef}
      class="drag-indicator"
      draggable={endDraggable}
      on:dragstart={onDragStart}
      on:drag={onDrag}
    ></span>
  </button>
</li>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { DateGallery, DateGalleryEvent, DateGalleryFrame } from "@uiloos/core";
  import type { EventData} from "../../events";
  import { ariaLabelForEvent } from "../../events";
  import { yiq, getMinutesSinceStart, emptyImage } from "../../utils";
  import { timeFormatter } from "../../../formatters";
  import { WIDTH, START_HOUR } from '../config';

  export let dateGallery: DateGallery<EventData>;
  export let event: DateGalleryEvent<EventData>;
  export let gridRow: string;
  export let onClick: () => void;

  let eventRef: HTMLLIElement | null = null;
  let startDragRef: HTMLSpanElement | null = null;
  let endDragRef: HTMLSpanElement | null = null;

  let startDraggable = true;
  let endDraggable = true;

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
    dragData.dragStartTime = new Date(event.startDate).getTime();
    dragData.dragEndTime = new Date(event.endDate).getTime();

    if (e.dataTransfer && image) {
      // Set the drag image to an empty image. Because we are
      // going to continuously "move" the event we do not need
      // a "ghost".
      e.dataTransfer.setDragImage(image, 0, 0);
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

      if (e.target === eventRef) {
        // Move both start and end times with the same values
        // so the duration of the event stays the same.
        event.move({
          startDate: new Date(dragData.dragStartTime + msMoved),
          endDate: new Date(dragData.dragEndTime + msMoved),
        });
      } else if (e.target === startDragRef) {
        // Move only the start time
        event.move({
          startDate: new Date(dragData.dragStartTime + msMoved),
          endDate: event.endDate,
        });
      } else {
        // Move only the end time
        event.move({
          startDate: event.startDate,
          endDate: new Date(dragData.dragEndTime + msMoved),
        });
      }
    }
  }

  let gridColumn = "";
  let showStartTime = false;
  let showEndTime = false;

  $: sync(dateGallery.firstFrame)

  function sync(frame: DateGalleryFrame<EventData>) {
    const dayDate = dateGallery.firstFrame.anchorDate;

    if (event.spansMultipleDays) {
      if (dateGallery.isSameDay(event.startDate, dayDate)) {
        // When the event starts on this day, make it span the
        // entire day, as we know it does not end on this day.
        const start = getMinutesSinceStart(event.startDate, START_HOUR);
        gridColumn = `${start + 1} / ${WIDTH}`;

        // No end time indicator as it is on another day
        endDraggable = false;

        // Show start time only on first day
        showStartTime = true;
      } else if (dateGallery.isSameDay(event.endDate, dayDate)) {
        // When the event ends on this day start it at midnight, since
        // we know it started on a previous day.
        const end = getMinutesSinceStart(event.endDate, START_HOUR);
        gridColumn = `1 / ${end + 2}`;

        // No start time drag indicator as it is on another day
        startDraggable = false;

        // Show end time only on last day
        showEndTime = true;
      } else {
        // When the event is during this whole day
        gridColumn = `1 / ${WIDTH}`;

        // No start / end drag indicator as it is on another day
        startDraggable = false;
        endDraggable = false;
      }
    } else {
      // The event is contained within this day.

      const start = getMinutesSinceStart(event.startDate, START_HOUR);
      const end = getMinutesSinceStart(event.endDate, START_HOUR);

      gridColumn = `${start + 1} / ${end + 1}`;

      // When fully in this day show both times
      showStartTime = true;
      showEndTime = true;
    }
  }

  let image: HTMLImageElement | null = null;
  onMount(() => {
    image = emptyImage();
  }); 
</script>

<style>
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