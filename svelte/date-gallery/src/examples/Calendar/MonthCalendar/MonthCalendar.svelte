<div class="calendar-month">
  <ul class="calendar-month-daynames">
    <li class="calendar-month-dayname">Sun</li>
    <li class="calendar-month-dayname">Mon</li>
    <li class="calendar-month-dayname">Tue</li>
    <li class="calendar-month-dayname">Wed</li>
    <li class="calendar-month-dayname">Thu</li>
    <li class="calendar-month-dayname">Fri</li>
    <li class="calendar-month-dayname">Sat</li>
  </ul>

  <ul class="calendar-month-daycells">
    {#each dateGallery.firstFrame.dates.map(processDateObj) as { dateObj, date, ariaLabel, eventsForDay, gridTemplateRows } (dateObj.date.toISOString())}
      <li
        class="calendar-month-daycell"
        class:padding={dateObj.isPadding}
        role="button"
        aria-label={ariaLabel}
        on:click={() => openNewEventForm(date)}
        on:dragover={(e) => onDragOver(e, dateObj)}
      >
        <button
          class="calendar-month-daycell-number"
          on:click={(e) => {
            e.stopPropagation();
            
            dateGallery.changeConfig({
              initialDate: dateObj.date,
              mode: "day",
              numberOfFrames: 1,
            });
          }}
        >
          <time dateTime={dateObj.date.toISOString()}>
            {dateObj.date.getDate()}
            </time>
        </button>

        <ul 
          class="calendar-month-daycell-events" 
          style:grid-template-rows={gridTemplateRows}
        >
          {#each dateObj.events as event (event.data.id)}
            <!--
              Here we put an event on a specific row in the CSS grid
              by doing this all event that are on multiple days are
              neatly ordered within a week, without any gaps.

              See the `calculateEventPositionByDay` function below to
              see how this is calculated.

              The +1 is needed because CSS Grid starts counting at 1.
           -->
          <MonthEvent
            event={event}
            dateGallery={dateGallery}
            dateObj={dateObj}
            gridRow={eventsForDay.indexOf(event) + 1 ?? 2}
            onDrag={(event) => {
              draggedEvent = event;
            }}
            onClick={() => openEditEventForm(event)}
          />
          {/each}
        </ul>  
      </li>
    {/each}
  </ul>
</div>

<script lang="ts">
  import { DateGallery } from "@uiloos/core";
  import { DateGalleryEvent } from '@uiloos/core';
  import type { DateGalleryDate, } from '@uiloos/core';
  import { dateTimeFormatter } from "../../formatters";
  import type { EventData } from "../events";
  import MonthEvent from './components/MonthEvent.svelte';

  export let dateGallery: DateGallery<EventData>;
  export let openNewEventForm: (date: Date) => void;
  export let openEditEventForm: (event: DateGalleryEvent<EventData>) => void;

  let eventPositionsByDay = calculateEventPositionByDay(dateGallery);

  $: eventPositionsByDay = calculateEventPositionByDay(dateGallery);

  function processDateObj(dateObj: DateGalleryDate<EventData>, index: number) {
    const eventsForDay = eventPositionsByDay[index];

    // Set the aria label of the button to something sensible
    const date = new Date(dateObj.date);

    // Set the date to the current hour, and to the closest 5 minutes
    const now = new Date();
    date.setHours(now.getHours(), Math.round(now.getMinutes() / 5) * 5);

    const formatted = dateTimeFormatter.format(date);
    const ariaLabel = `Create new event at around ${formatted}`;

    const noRows = eventsForDay.length;
    const gridTemplateRows = `repeat(${noRows}, 32px)`;

    return {
      dateObj,
      date,
      ariaLabel,
      gridTemplateRows,
      eventsForDay 
    };
  }

  let draggedEvent: DateGalleryEvent<EventData> | null = null;

  function onDragOver(
    e: DragEvent,
    dateObj: DateGalleryDate<EventData>,
  ) {
    e.stopPropagation();

    if (!draggedEvent) {
      return;
    }

    // Create a new startDate based on the date that the event
    // has been dragged over.
    const startDate = new Date(dateObj.date);

    // Now copy the original start hours.
    startDate.setHours(
      draggedEvent.startDate.getHours(),
      draggedEvent.startDate.getMinutes(),
    );

    // Calculate the duration of the event.
    const duration =
      draggedEvent.endDate.getTime() - draggedEvent.startDate.getTime();

    // Add the duration to the new startDate to get the endDate
    const endDate = new Date(startDate.getTime() + duration);

    draggedEvent.move({
      startDate,
      endDate,
    });
  }

  /* 
    Takes a calendar and returns an array of arrays, each
    subarray represents a day and contains all events of that
    day. 
  
    The position / index of the event with the "day" array is 
    the "row" it should be put in the CSS Grid.
  
    The events are packed as tight as possible so the least
    amount of rows are used.
  */
  function calculateEventPositionByDay(dateGallery: DateGallery<EventData>) {
    // Will contain an array for each day of the month
    const month: DateGalleryEvent<EventData>[][] = [];

    dateGallery.firstFrame.dates.forEach((dateObj, index) => {
      // Will contain all events within the day.
      const day: DateGalleryEvent<EventData>[] = [];

      const prevDay = month[index - 1];

      dateObj.events.forEach((event) => {
        if (!event.spansMultipleDays) {
          return;
        }

        // If there is a previous day, meaning it is not the
        // first day of the displayed month calendar
        if (prevDay) {
          // Try finding the event within the previous day
          const index = prevDay.indexOf(event);

          // If the event exists add it on this day at the same index / row
          // as the day before, this makes an event appear on the same
          // row for multiple days which is visually pleasing.
          if (index !== -1) {
            day[index] = event;
            return;
          }
        }

        let firstEmptyIndex = 0;

        // Find the first empty position within the `day` array.
        // This way we find the first empty row and fill it, this
        // makes sure the events are packed close together.
        while (day[firstEmptyIndex]) {
          firstEmptyIndex++;
        }

        day[firstEmptyIndex] = event;
      });

      month.push(day);
    });

    return month;
  }
</script>

<style>
.calendar-month-daynames {
  display: grid;
  grid-template-columns:  repeat(7, minmax(32px, 1fr));;
  gap: 2px;
}

.calendar-month-dayname {
  display: grid;
  place-content: center;
  height: 100px;
  font-size: 22px;
}

.calendar-month-daycells {
  display: grid;
  grid-template-columns:  repeat(7, minmax(32px, 1fr));;
  gap: 0;
  list-style-type: none;
}

.calendar-month-daycell {
  display: grid;
  gap: 4px;
  align-content: start;
  box-shadow: 0 0 0 1px black;
  min-height: 120px;
  font-size: 22px;
  background-color: white;
  cursor: pointer;
  padding-bottom: 8px;
}

.calendar-month-daycell.padding {
  color: gray;
}

.calendar-month-daycell-number {
  padding: 4px;
  justify-self: right;
  background-color: white;
  font-size: 22px;
  color: inherit;
}

.calendar-month-daycell-events {
  display: grid;
  grid-template-rows: 32px;
  gap: 4px;
  height: 100%;
}

</style>