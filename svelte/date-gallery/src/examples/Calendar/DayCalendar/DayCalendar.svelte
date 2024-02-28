<ul class="calendar-day-grid" style="--width: {WIDTH}">
  <HourIndicators
    dateGallery={dateGallery}
    openNewEventForm={openNewEventForm}
    rows={rows}
  />

  <CurrentHour dateGallery={dateGallery} rows={rows} />

  {#each dateGallery.firstFrame.events as event (event.data.id)}
    <DayEvent
      event={event}
      dateGallery={dateGallery}
      gridRow={eventRows.get(event) ?? ''}
      onClick={() => openEditEventForm(event)}
    />
  {/each}
</ul>

<script lang="ts">
  import type { DateGallery, DateGalleryEvent } from "@uiloos/core";
  import { packEventsOnAxis} from "../events";
  import type { EventData } from "../events";
  import CurrentHour from "./components/CurrentHour.svelte";
  import DayEvent from "./components/DayEvent.svelte";
  import HourIndicators from "./components/HourIndicators.svelte";
  import { WIDTH } from './config';

  export let dateGallery: DateGallery<EventData>;
  export let openNewEventForm: (date: Date) => void;
  export let openEditEventForm: (event: DateGalleryEvent<EventData>) => void;

  let eventRows = calculateEventRows(dateGallery);
  let rows = getNoRows(eventRows);

  $: sync(dateGallery);
  function sync(dateGallery: DateGallery<EventData>) {
    eventRows = calculateEventRows(dateGallery);

    rows = getNoRows(eventRows);
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

<style>
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