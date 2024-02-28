<template>
  <div class="calendar-example">
    <EventForm
      v-if="showForm"
      :formEvent="formEvent as DateGalleryEvent<EventData> | undefined"
      :formDate="formDate"
      @close="($event) => closeEventForm()"
      :dateGallery="dateGallery"
    />

    <div class="calender-topbar">
      <div class="calendar-mode">
        <button
          v-for="content in modeSegmentedButton.contents"
          :key="content.value.mode"
          @click="() => activateMode(content.value.mode)"
          :class="{ active: content.isActive }"
        >
          {{ content.value.label }}
        </button>
      </div>

      <div class="calendar-controls">
        <button
          class="calendar-previous calendar-button"
          @click="() => dateGallery.previous()"
        >
          previous
        </button>

        <span class="calendar-title">
          <MonthCalendarTitle
            v-if="dateGallery.mode === 'month-six-weeks'"
            :anchorDate="dateGallery.firstFrame.anchorDate"
          />
          <YearCalendarTitle
            v-else-if="dateGallery.mode === 'month'"
            :anchorDate="dateGallery.firstFrame.anchorDate"
          />
          <WeekCalendarTitle
            v-else-if="dateGallery.mode === 'week'"
            :anchorDate="dateGallery.firstFrame.anchorDate"
          />
          <DayCalendarTitle
            v-else
            :anchorDate="dateGallery.firstFrame.anchorDate"
          />
        </span>

        <button
          class="calendar-next calendar-button"
          @click="() => dateGallery.next()"
        >
          next
        </button>
      </div>

      <div class="calendar-actions">
        <button
          class="calendar-today calendar-button"
          @click="() => dateGallery.today()"
        >
          today
        </button>

        <button
          class="calendar-add-event calendar-button"
          @click="() => openNewEventForm(new Date())"
        >
          + add event
        </button>
      </div>
    </div>

    <div class="calendar-wrapper">
      <MonthCalendar
        v-if="dateGallery.mode === 'month-six-weeks'"
        :dateGallery="dateGallery"
        :trigger="trigger"
        @open-new-event-form="(date: Date) => openNewEventForm(date)"
        @open-edit-event-form="
          (event: DateGalleryEvent<EventData>) => openEditEventForm(event)
        "
      />

      <YearCalendar
        v-else-if="dateGallery.mode === 'month'"
        :dateGallery="dateGallery"
        :trigger="trigger"
      />

      <WeekCalendar
        v-else-if="dateGallery.mode === 'week'"
        :dateGallery="dateGallery"
        :trigger="trigger"
        @open-new-event-form="(date: Date) => openNewEventForm(date)"
        @open-edit-event-form="
          (event: DateGalleryEvent<EventData>) => openEditEventForm(event)
        "
      />

      <DayCalendar
        v-else
        :dateGallery="dateGallery"
        :trigger="trigger"
        @open-new-event-form="(date: Date) => openNewEventForm(date)"
        @open-edit-event-form="
          (event: DateGalleryEvent<EventData>) => openEditEventForm(event)
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useDateGallery, useActiveList } from "@uiloos/vue";
import { generateEvents } from "./events";
import type { EventData } from "./events";
import { isoFormatter } from "../formatters";
import { DateGalleryEvent } from "@uiloos/core";
import type { ActiveListContentPredicateData } from "@uiloos/core";
import type { DateGalleryConfig, DateGalleryMode } from "@uiloos/core";
import YearCalendar from "./YearCalendar/YearCalendar.vue";
import YearCalendarTitle from "./YearCalendar/YearCalendarTitle.vue";
import WeekCalendar from ".//WeekCalendar/WeekCalendar.vue";
import WeekCalendarTitle from ".//WeekCalendar/WeekCalendarTitle.vue";
import DayCalendar from "./DayCalendar/DayCalendar.vue";
import DayCalendarTitle from "./DayCalendar/DayCalendarTitle.vue";
import MonthCalendar from "./MonthCalendar/MonthCalendar.vue";
import MonthCalendarTitle from "./MonthCalendar/MonthCalendarTitle.vue";
import EventForm from "./EventForm/EventForm.vue";
import { isValid } from "date-fns";

const { mode, numberOfFrames, initialDate } = readConfigFromUrl();

const dateGallery = useDateGallery({
  mode,
  numberOfFrames,
  initialDate,
  events: generateEvents(),
});

/*
  Behind the scenes @uiloos/vue uses a shallowRef and manually 
  triggers changes via a triggerRefcall whenever an event 
  occurs.

  The problem is that shallowRef's only work one level deep, 
  when you pass the dateGallery down to a child component
  it no longer triggers an update, for the child component.

  This limitiation is known in Vue.js see:
  1. https://github.com/vuejs/core/issues/7614
  2. https://github.com/vuejs/docs/issues/849#issuecomment-1382072571

  My solution here is to tickle Vue by updating a number (trigger)
  and passing that number down. This way whenever the number
  changes the child components updates, this will cause it to 
  use data from the DateGallery and therefore update. 
*/
let trigger = ref(0);
let unsubscribe = dateGallery.value.subscribe(() => {
  trigger.value++;
});

type Mode = {
  mode: DateGalleryMode;
  label: string;
};

const modeOptions: Mode[] = [
  { mode: "month", label: "Year" },
  { mode: "month-six-weeks", label: "Month" },
  { mode: "week", label: "Week" },
  { mode: "day", label: "Day" },
];

const modeSegmentedButton = useActiveList({
  contents: modeOptions,
  activeIndexes: modeOptions.findIndex((option) => option.mode === mode),
});

// Sync the query parameters, so that the url changes and the
// user can reload the page and still see the same calendar
watch(
  () => dateGallery.value.mode,
  () => syncSearchParams(),
);
watch(
  () => dateGallery.value.firstFrame.anchorDate,
  () => syncSearchParams(),
);

function syncSearchParams() {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", dateGallery.value.mode);
  url.searchParams.set(
    "initialDate",
    isoFormatter.format(dateGallery.value.firstFrame.anchorDate),
  );

  // Only push if the url has actually changed,
  // otherwise it will push duplicates.
  if (url.href !== window.location.href) {
    window.history.pushState({}, "", url);
    activateMode(dateGallery.value.mode);
  }
}

// Activates a mode and syncs both the dateGallery and modeSegmentedButton (ActiveList)
// This way no matter how the mode changes, either from inside the dateGallery subscriber
// or via a button click on the mode segemented button they will always be in sync.
function activateMode(mode: DateGalleryMode) {
  // Step 1: sync with the segmented button
  modeSegmentedButton.value.activateByPredicate(
    (data: ActiveListContentPredicateData<Mode>) => {
      return data.value.mode === mode;
    },
  );

  // Step 2: sync with the DateGallery

  // When the 'mode' is month it means 'year' has been selected
  // and we show 12 month calenders side by side.
  if (mode === "month") {
    // Anchor date to january first, otherwise the 'year' will start
    // at the current month.
    const initialDate = new Date(dateGallery.value.firstFrame.anchorDate);
    initialDate.setMonth(0);
    initialDate.setDate(1);

    dateGallery.value.changeConfig({
      mode,
      numberOfFrames: 12,
      initialDate,
    });
  } else {
    dateGallery.value.changeConfig({ mode, numberOfFrames: 1 });
  }
}

let showForm = ref(false);
let formEvent = ref<DateGalleryEvent<EventData> | undefined>(undefined);
let formDate = ref<Date | undefined>(undefined);

function openNewEventForm(date: Date) {
  showForm.value = true;
  formDate.value = date;
  formEvent.value = undefined;
}

function openEditEventForm(event: DateGalleryEvent<EventData>) {
  showForm.value = true;
  formDate.value = undefined;
  formEvent.value = event;
}

function closeEventForm() {
  showForm.value = false;
  formEvent.value = undefined;
}

function readConfigFromUrl(): DateGalleryConfig<EventData> {
  const url = new URL(window.location.href);

  let mode = url.searchParams.get("mode") ?? "month";

  if (
    !["month", "month-six-weeks", "week", "day"].includes(mode.toLowerCase())
  ) {
    mode = "month";
  }

  const typedMode = mode as DateGalleryMode;

  const numberOfFrames = mode === "month" ? 12 : 1;

  let initialDate = url.searchParams.get("initialDate") ?? new Date();
  initialDate = new Date(initialDate);

  if (!isValid(initialDate)) {
    initialDate = new Date();
  }

  return {
    mode: typedMode,
    numberOfFrames,
    initialDate,
  };
}

const syncFromUrl = () => {
  const config = readConfigFromUrl();

  dateGallery.value.changeConfig(config);

  modeSegmentedButton.value.activateByPredicate(
    (data: ActiveListContentPredicateData<Mode>) => {
      return data.value.mode === config.mode;
    },
  );
};

onMounted(() => {
  window.addEventListener("popstate", syncFromUrl);
});

onUnmounted(() => {
  window.removeEventListener("popstate", syncFromUrl);

  unsubscribe();
});
</script>

<style scoped>
.calendar-example {
  display: grid;
  gap: 8px;
  font-family: Arial, Helvetica, sans-serif;
}

.calendar-example button {
  cursor: pointer;
}

.calendar-example ul {
  list-style: none;
}

.calendar-example .calender-topbar {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-areas: "left center right";
  place-items: center;
  margin-bottom: 16px;
}

.calendar-actions,
.calendar-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-example .calendar-mode {
  display: flex;
  justify-content: center;
}

.calendar-example .calendar-mode button {
  padding: 8px;
}

.calendar-example .calendar-mode button.active {
  padding: 8px;
  background-color: black;
  color: white;
}

.calendar-example .calendar-button {
  border: 1px solid black;
  padding: 4px;
}

.calendar-example .calendar-title {
  font-size: 26px;
}
</style>
