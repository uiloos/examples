<template>
  <Dialog
    @keydown="
      {
        onKeyDown($event);
      }
    "
    @close="
      {
        emit('close');
      }
    "
  >
    <div class="datepicker-dialog-content">
      <div class="topbar">
        <button
          aria-label="previous"
          type="button"
          @click="dateGallery.previous()"
        >
          ‹
        </button>
        <span>
          <MonthSelect
            :dateGallery="dateGallery"
            :month="dateGallery.firstFrame.anchorDate.getMonth()"
          />
          <YearInput :dateGallery="dateGallery" />
        </span>
        <button
          aria-label="next"
          type="button"
          @click="($event) => dateGallery.next()"
        >
          ›
        </button>
      </div>

      <ul class="daygrid">
        <li>
          <abbr title="Sunday">S</abbr>
        </li>
        <li>
          <abbr title="Monday">M</abbr>
        </li>
        <li>
          <abbr title="Tuesday">T</abbr>
        </li>
        <li>
          <abbr title="Wednesday">W</abbr>
        </li>
        <li>
          <abbr title="Thursday">T</abbr>
        </li>
        <li>
          <abbr title="Friday">F</abbr>
        </li>
        <li>
          <abbr title="Saturday">S</abbr>
        </li>
      </ul>

      <ul class="dates daygrid">
        <li
          v-for="dateObj in dateGallery.firstFrame.dates"
          :key="dateObj.date.toISOString()"
          :style="{ 'grid-column': dateObj.date.getDay() + 1 }"
        >
          <button
            :aria-label="`Select ${dateFormatter.format(dateObj.date)}`"
            type="button"
            :class="{ selected: dateObj.isSelected, today: dateObj.isToday }"
            :disabled="!dateObj.canBeSelected"
            @click="($event) => onDateClicked(dateObj)"
          >
            <time :dateTime="dateObj.date.toISOString()">
              {{ dateObj.date.getDate() }}
            </time>
          </button>
        </li>
      </ul>

      <div class="bottombar">
        <button type="button" @click="emit('close')">Cancel</button>
        <button type="button" @click="dateGallery.today()">Today</button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDateGallery } from "@uiloos/vue";
import { isValid } from "date-fns";
import { DateGalleryDate } from "@uiloos/core";
import { dateFormatter } from "../formatters";
import MonthSelect from "./MonthSelect.vue";
import YearInput from "./YearInput.vue";
import Dialog from "../Dialog/Dialog.vue";
import { parseAsDate } from "./utils";

interface Props {
  value: string;
  min?: Date;
  max?: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "change", date: string): void;
  (e: "close"): void;
}>();

let initialDate = new Date();
if (props.value) {
  const date = parseAsDate(props.value);

  if (isValid(date)) {
    initialDate = date as Date;
  }
}

const dateGallery = useDateGallery({
  mode: "month",
  initialDate,
  selectedDates: [initialDate],
  maxSelectionLimit: 1,

  canSelect(dateObj: DateGalleryDate<unknown>) {
    if (props.min && dateObj.date < props.min) {
      return false;
    } else if (props.max && dateObj.date > props.max) {
      return false;
    }

    return true;
  },
});

function onDateClicked(dateObj: DateGalleryDate<unknown>) {
  const date = dateFormatter.format(dateObj.date);

  emit("change", date);
  emit("close");
}

function onKeyDown(event: KeyboardEvent) {
  // Do not interfere with the year <input>
  if (
    event.target &&
    event.target instanceof HTMLElement &&
    event.target.nodeName &&
    event.target.nodeName === "INPUT"
  ) {
    return;
  }

  // Stop the propagation here so not all elements
  // are called for better performance.
  event.stopPropagation();

  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    // Copy date as not to mutate the selected date.
    const date = new Date(dateGallery.value.selectedDates[0]);

    // Mutate the date based on the arrow keys
    if (event.key === "ArrowLeft") {
      date.setDate(date.getDate() - 1);
    } else if (event.key === "ArrowRight") {
      date.setDate(date.getDate() + 1);
    } else if (event.key === "ArrowUp") {
      date.setDate(date.getDate() - 7);
    } else if (event.key === "ArrowDown") {
      date.setDate(date.getDate() + 7);
    }

    // Select the date so it highlights in blue.
    dateGallery.value.selectDate(date);

    // Change the initialDate (changes the frames) so the user
    // can navigate to other months.
    dateGallery.value.changeConfig({ initialDate: date });
  } else if (event.key === "Enter") {
    // When enter is pressed close the dialog and set
    // the value to the selected date.

    // We do not want the dialog to open again.
    event.preventDefault();

    const date = dateFormatter.format(dateGallery.value.selectedDates[0]);

    emit("change", date);
    emit("close");
  }
}
</script>

<style scoped>
button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

ul {
  list-style-type: none;
}

.datepicker-dialog-content {
  display: grid;
  justify-items: center;
  height: 360px;
}

.topbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  align-self: start;
}

.topbar button {
  width: 42px;
  font-size: 32px;
  background-color: white;
}

.daygrid {
  display: grid;
  grid-template-columns: repeat(7, 42px);
  justify-items: center;
  align-self: end;
}

.dates button {
  width: 42px;
  height: 42px;
  background-color: white;
}

.dates .today {
  background-color: limegreen;
  font-weight: bold;
  border-radius: 100%;
}

.dates .selected {
  background-color: skyblue;
  font-weight: bold;
  border-radius: 100%;
}

.bottombar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.bottombar button {
  padding: 4px;
}
</style>
