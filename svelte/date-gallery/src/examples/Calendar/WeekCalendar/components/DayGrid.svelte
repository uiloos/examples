<ul
  data-date={date.getTime()}
  class="calendar-week-day-grid"
  style:grid-column={gridColumn}
  on:click={(e) => {
    if (e.target instanceof HTMLElement) {
      // To determine the minute we look to where the user
      // clicked in the day cell. Remember: the day cell
      // is HEIGHT in height, one pixel per minute.
      const rect = e.target.getBoundingClientRect();
      const distanceInMinutes = e.clientY - rect.top;

      let hour = Math.floor(distanceInMinutes / 60);
      hour += START_HOUR;

      let minute = Math.round(distanceInMinutes % 60);
      // Round to closest 5 minutes
      minute = Math.round(minute / 5) * 5;

      const startDate = new Date(date);
      startDate.setHours(hour, minute);
      openNewEventForm(startDate);
    }
  }}
>
  <slot/>
</ul>

<script lang="ts">
  import { START_HOUR } from "../config";
  
  export let date: Date;
  export let gridColumn: number;
  export let openNewEventForm: (date: Date) => void;

</script>

<style>
.calendar-week-day-grid {
  grid-row: 2 / var(--height);
  display: grid;
  grid-template-rows: repeat(var(--height), 1px);
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  border-right: 1px solid black;
  column-gap: 8px;
  padding: 0 4px;
  cursor: pointer;
  list-style-type: none;
}
</style>
