<ul class="calendar-year-months">
  {#each dateGallery.frames as frame (frame.anchorDate.toISOString())}
    <li class="calendar-year">
      <button
        class="calendar-year-monthname"
        on:click={() => {
          dateGallery.changeConfig({
            mode: "month-six-weeks",
            numberOfFrames: 1,
            initialDate: frame.anchorDate,
          });
        }}
      >
        {monthFormatter.format(frame.anchorDate)}
      </button>

      <ul class="calendar-year-daynames">
        <li class="calendar-year-dayname">
          <abbr title="Sunday">S</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Monday">M</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Tuesday">T</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Wednesday">W</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Thursday">T</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Friday">F</abbr>
        </li>
        <li class="calendar-year-dayname">
          <abbr title="Saturday">S</abbr>
        </li>
      </ul>

      <ul class="calendar-year-daycells">
        {#each frame.dates as dateObj (dateObj.date.toISOString())}
          <!-- 
            Place the days in the correct column, this is only needed
            for the "month" mode because it starts at the first of the 
            month, which may be on an other day than the start of 
            the week.

            The +1 is needed because CSS Grid starts counting at 1.
          -->
          <li
            class="calendar-year-daycell"
            class:has-event={dateObj.hasEvents}    
            style:grid-column={ dateObj.date.getDay() + 1 }
          >
            <button
              class="calendar-year-daycell-number"
              on:click={() =>
                dateGallery.changeConfig({
                  initialDate: dateObj.date,
                  mode: "day",
                  numberOfFrames: 1,
                })
              }
            >
              <time dateTime={dateObj.date.toISOString()}>
                {dateObj.date.getDate()}
              </time>
            </button>
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<script lang="ts">
  import type { DateGallery } from "@uiloos/core";
  import { monthFormatter } from "../../formatters";
  import type { EventData } from "../events";

  export let dateGallery: DateGallery<EventData>;
</script>

<style>
ul {
  list-style: none;
}

button {
  cursor: pointer;
}

.calendar-year-months {
  display: grid;
  place-content: center;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
  width: calc(320px * 3);
  margin: auto;
}

.calendar-year {
  width: 320px;
}

.calendar-year-monthname {
  width: 100%;
  text-align: center;
  padding: 16px 0px;
  font-size: 22px;
  background-color: white;
}

.calendar-year-daynames {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 2px;
  margin-bottom: 16px;
}

.calendar-year-dayname {
  display: grid;
  place-content: center;
  height: 16px;
  font-size: 22px;
}

.calendar-year-daycells {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0;
}

.calendar-year-daycell {
  display: grid;
  place-items: center;
  height: 32px;
  background-color: white;
  cursor: pointer;
}

.calendar-year-daycell .calendar-year-daycell-number {
  background-color: white;
}

.calendar-year-daycell.has-event .calendar-year-daycell-number {
  display: grid;
  place-items: center;
  background-color: black;
  color: white;
  border-radius: 100%;
  padding: 4px;
  font-weight: bold;
  width: 26px;
  height: 26px;
}
</style>