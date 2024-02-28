<li  
  class="calendar-month-event"
  class:multiple={event.spansMultipleDays}
  class:first-day-of-event={event.spansMultipleDays && dateGallery.isSameDay(event.startDate, dateObj.date)}
  
  style:grid-row={gridRow}
  style:background-color={event.spansMultipleDays ? event.data.color : undefined}
  style:--color={event.data.color}

  draggable={true}
  on:dragstart={onDragStart}
  
  on:click={(e) => {
    e.stopPropagation();
    onClick();
  }}
>
  <button
    class="calendar-month-event-wrapper"
    style:color={event.spansMultipleDays ? yiq(event.data.color) : undefined}
    aria-label={ariaLabelForEvent(event)}
  >
    <span class="calendar-month-event-title">{title}</span>
    <span class="calendar-month-event-time">{time}</span>
  </button>
</li>


<script lang="ts">
  import { onMount } from 'svelte';
  import type { DateGallery, DateGalleryEvent, DateGalleryDate } from "@uiloos/core";
  import type { EventData } from "../../events";
  import { ariaLabelForEvent } from "../../events";
  import { yiq, emptyImage } from "../../utils";
  import { timeFormatter } from "../../../formatters";

  export let dateGallery: DateGallery<EventData>;
  export let event: DateGalleryEvent<EventData>;
  export let dateObj: DateGalleryDate<EventData>;
  export let gridRow: number;
  export let onClick: () => void;
  export let onDrag: (event: DateGalleryEvent<EventData>) => void;

  let title = "";
  let time = "";

  $: sync(event.spansMultipleDays);

  function sync(spansMultipleDays: boolean) {
    if (event.spansMultipleDays) {
      /*
        An event that spans multiple days is rendered once in each 
        day the event occurs. 
            
        On the startDate we render the title and start time, on the 
        endDate we render the end time. For all days in between we 
        only give it a background color.
      */
      if (dateGallery.isSameDay(event.startDate, dateObj.date)) {
        title = event.data.title;
        time = timeFormatter.format(event.startDate);
      } else if (dateGallery.isSameDay(event.endDate, dateObj.date)) {
        time = timeFormatter.format(event.endDate);
      }
    } else {
      // When an event happens on a single day show the title and start time.
      title = event.data.title;
      time = timeFormatter.format(event.startDate);
    }
  }

  function onDragStart(e: DragEvent) {
    e.stopPropagation();

    onDrag(event);

    if (e.dataTransfer && image) {
      // Set the drag image to an empty image. Because we are
      // going to continuously "move" the event we do not need
      // a "ghost".
      e.dataTransfer.setDragImage(image, 0, 0);
    }
  }

  let image: HTMLImageElement | null = null;
  onMount(() => {
    image = emptyImage();
  }); 
</script>

<style>
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
</style>