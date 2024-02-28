<template>
  <div
    v-if="dateGallery.firstFrame.dates[0].isToday"
    ref="ref"
    class="calendar-day-current-time"
    :style="{ 'grid-row': `1 / ${rows}` }"
  ></div>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { DateGallery } from "@uiloos/core";
import { timeFormatter } from "../../../formatters";
import type { EventData } from "../../events";
import { getMinutesSinceStart } from "../../utils";
import { START_HOUR } from "../config";

interface Props {
  dateGallery: DateGallery<EventData>;
  rows: number;
  trigger: number;
}

const props = defineProps<Props>();

let ref: HTMLDivElement | null = null;

let interval = -1;

watch(() => props.trigger, sync);
function sync() {
  clearInterval(interval);

  if (props.dateGallery.firstFrame.dates[0].isToday) {
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
  ref.style.gridColumn = `${column} / ${column + 1}`;

  ref.setAttribute("time", timeFormatter.format(now));
}

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
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
