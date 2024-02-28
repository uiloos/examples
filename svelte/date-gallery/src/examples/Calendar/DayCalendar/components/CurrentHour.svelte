
{#if dateGallery.firstFrame.dates[0].isToday}
  <div
    bind:this={ref}
    class="calendar-day-current-time"
    style:grid-row={`1 / ${rows}`}
  ></div>
{/if}

<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { DateGallery, DateGalleryFrame } from "@uiloos/core";
  import { timeFormatter } from "../../../formatters";
  import type { EventData } from "../../events";
  import { getMinutesSinceStart } from "../../utils";
  import { START_HOUR } from "../config";

  export let dateGallery: DateGallery<EventData>;
  export let rows: number;

  let ref: HTMLDivElement | null = null;

  let interval = -1;

  $: sync(dateGallery.firstFrame);

  function sync(frame: DateGalleryFrame<EventData>) {
    clearInterval(interval);

    if (dateGallery.firstFrame.dates[0].isToday) {
      interval = window.setInterval(() => {
        update();
      }, 1000);

      // Trigger update after 1 ms so the ref is filled in,
      // without this timeout it would take 1s for the 
      // indicator to show up.
      setTimeout(() => {
        update();
      }, 1);
    }
  }

  function update() {
    if (!ref) {
      return;
    }

    const now = new Date();
    const column = getMinutesSinceStart(now, START_HOUR);
    ref.style.gridColumn = `${column + 1} / ${column + 2}`;

    ref.setAttribute("time", timeFormatter.format(now));
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<style>
.calendar-day-current-time {
  background-color: orangered;
  width: 1px;
}

.calendar-day-current-time:hover::after {
  content: attr(time);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: orangered;
  width: 62px;
  height: 32px;
}
</style>