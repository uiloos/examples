{#each dateGallery.firstFrame.dates as dateObj, index (dateObj.date.toISOString())}
  <button
    class="calendar-week-dayname"
    style:grid-column={index + 2}
    on:click={(e) => {
      e.preventDefault();
      
      dateGallery.changeConfig({
        initialDate: dateObj.date,
        mode: "day",
        numberOfFrames: 1,
      });
    }}
  >
    <time dateTime={dateObj.date.toISOString()}>
      {weekDayFormatter.format(dateObj.date)}
    </time>
  </button>
{/each}

<script lang="ts">
  import type { DateGallery } from "@uiloos/core";
  import { weekDayFormatter } from "../../../formatters";
  import type { EventData } from "../../events";

  export let dateGallery: DateGallery<EventData>;
</script>

<style>
.calendar-week-dayname {
  align-self: self-end;
  position: sticky;
  top: 0;
  margin-bottom: 8px;
  text-align: center;
  font-size: 22px;
  background-color: white;
  opacity: 0.8;
  z-index: 1;
}
</style>