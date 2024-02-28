<template>
  <div class="calendar-week" :style="{ '--height': HEIGHT }">
    <div class="calendar-week-grid">
      <HourIndicators />

      <DayNames :dateGallery="dateGallery" />

      <DayGrid
        v-for="(
          { dateObj, eventColumns }, index
        ) in dateGallery.firstFrame.dates.map(processDates)"
        :key="dateObj.date.toISOString()"
        @open-new-event-form="(date: Date) => emit('openNewEventForm', date)"
        :date="dateObj.date"
        :gridColumn="index + 2"
        :trigger="trigger"
      >
        <WeekEvent
          v-for="event in dateObj.events"
          :key="event.data.id"
          :event="event"
          :dateGallery="dateGallery"
          :date="dateObj.date"
          :gridColumn="eventColumns.get(event) ?? ''"
          @click="() => emit('openEditEventForm', event)"
          :trigger="trigger"
        />
      </DayGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateGallery, DateGalleryEvent, DateGalleryDate } from "@uiloos/core";
import { packEventsOnAxis } from "../events";
import type { EventData } from "../events";
import HourIndicators from "./components/HourIndicators.vue";
import DayNames from "./components/DayNames.vue";
import DayGrid from "./components/DayGrid.vue";
import WeekEvent from "./components/WeekEvent.vue";
import { HEIGHT } from "./config";

interface Props {
  dateGallery: DateGallery<EventData>;
  trigger: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "openNewEventForm", date: Date): void;
  (e: "openEditEventForm", event: DateGalleryEvent<EventData>): void;
}>();

function processDates(dateObj: DateGalleryDate<EventData>) {
  const eventColumns = calculateEventColumns(dateObj);

  return { dateObj, eventColumns };
}

/* 
  Takes a DateGalleryDate and returns a Map to which the events 
  are keys, and the values are CSS gridColumn strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of columns are used.

  Note: since we are using a CSS grid we do get one limitation:
  you cannot always divide a CSS grid equally over multiple events.
  This is because CSS grids cannot have varying columns / rows, 
  meaning you cannot make one row have three columns, and the other
  row have two.

  This is a problem for us: say you have a day with five events, 
  three of which are overlapping, and the other two overlap as well. 
  This means we end up with 3 columns total to hold the three 
  overlapping events, but then the other 2 events also need to be 
  divided over three columns. 

  In an ideal world we would be able to say: CSS Grid make those 
  two events take the same amount of space in the 3 columms. 
  Essentialy making the 2 events the same size, but unfortunately 
  CSS cannot do this.

  So my solution is to make one of the two events take up 2/3 and 
  the other 1/3. Not ideal but it works
*/
function calculateEventColumns(dateObj: DateGalleryDate<EventData>) {
  // Step one: we place all events into the least amount of columns
  const columns = packEventsOnAxis(dateObj.events);

  // Step two: we take the columns array and turn it into a Map of CSS
  // grid column strings.
  const eventColumns = new Map<DateGalleryEvent<EventData>, string>();

  dateObj.events.forEach((event) => {
    // Shortcut if the event does not overlap make it span
    // all columns.
    if (!event.isOverlapping) {
      eventColumns.set(event, `1 / ${columns.length + 1}`);
      return;
    }

    // The start column is the first column this event can be found in.
    const startColumn = columns.findIndex((column) => column.includes(event));

    // Now that we have found the start, we need to find the end in the
    // remaining columns.
    const remainingColumns = columns.slice(startColumn);

    // The end column is the first column an overlapping event can be found in,
    // since it has to share the column with that event.
    let endColumn = remainingColumns.findIndex((column) =>
      column.some((otherEvent) => event.overlappingEvents.includes(otherEvent)),
    );

    // If we cannot find an endColumn it means it was already on the
    // last column, so place it there.
    if (endColumn === -1) {
      endColumn = columns.length;
    } else {
      // If the endColumn can be found we need to add the startColumn
      // to it since the remainingColumns start counting at 0 again,
      // so we need to make up the difference.
      endColumn += startColumn;
    }

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the columns.
    eventColumns.set(event, `${startColumn + 1} / ${endColumn + 1}`);
  });

  return eventColumns;
}
</script>

<style scoped>
.calendar-week {
  /* Is set from within JavaScript based on the visible hours */
  --height: 0;
}

.calendar-week-grid {
  display: grid;
  grid-template-columns: 100px repeat(7, minmax(120px, 1fr));
  grid-template-rows: 50px repeat(var(--height), 1px);
}
</style>
