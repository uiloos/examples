<template>
  <button
    v-for="(dateObj, index) in dateGallery.firstFrame.dates"
    :key="dateObj.date.toISOString()"
    class="calendar-week-dayname"
    :style="{ 'grid-column': index + 2 }"
    @click="
      ($event) => {
        $event.preventDefault();

        dateGallery.changeConfig({
          initialDate: dateObj.date,
          mode: 'day',
          numberOfFrames: 1,
        });
      }
    "
  >
    <time :dateTime="dateObj.date.toISOString()">
      {{ weekDayFormatter.format(dateObj.date) }}
    </time>
  </button>
</template>

<script setup lang="ts">
import { DateGallery } from "@uiloos/core";
import { weekDayFormatter } from "../../../formatters";
import type { EventData } from "../../events";

interface Props {
  dateGallery: DateGallery<EventData>;
}

const props = defineProps<Props>();
</script>

<style scoped>
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
