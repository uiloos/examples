<div class="calendar-example">
  {#if showForm}
    <EventForm
      formEvent={formEvent}
      formDate={formDate}
      onClose={closeEventForm}
      dateGallery={$dateGallery}
    />
  {/if}

  <div class="calender-topbar">
    <div class="calendar-mode">
      {#each $modeSegmentedButton.contents as content (content.value.mode)}
        <button
          on:click={() => activateMode(content.value.mode)}
          class:active={content.isActive}
        >
          {content.value.label}
        </button>
      {/each}
    </div>

    <div class="calendar-controls">
      <button
        class="calendar-previous calendar-button"
        on:click={() => $dateGallery.previous()}
      >
        previous
      </button>
      
      <span class="calendar-title">
        {#if $dateGallery.mode === "month-six-weeks"}
          <MonthCalendarTitle dateGallery={$dateGallery} />
        {:else if $dateGallery.mode === "month"}
          <YearCalendarTitle dateGallery={$dateGallery} />
        {:else if $dateGallery.mode === "week"}
          <WeekCalendarTitle dateGallery={$dateGallery} />
        {:else}
          <DayCalendarTitle dateGallery={$dateGallery} />
        {/if}
      </span>
      
      <button
        class="calendar-next calendar-button"
        on:click={() => $dateGallery.next()}
      >
        next
      </button>
    </div>

    <div class="calendar-actions">
      <button
        class="calendar-today calendar-button"
        on:click={() => $dateGallery.today()}
      >
        today
      </button>
    
      <button
        class="calendar-add-event calendar-button"
        on:click={() => openNewEventForm(new Date())}
      >
        + add event
        </button>
    </div>
  </div>

  <div class="calendar-wrapper">
    {#if $dateGallery.mode === "month-six-weeks"}
      <MonthCalendar
        dateGallery={$dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    {:else if $dateGallery.mode === "month"}
      <YearCalendar dateGallery={$dateGallery} />
    {:else if $dateGallery.mode === "week"}
      <WeekCalendar
        dateGallery={$dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    {:else}
      <DayCalendar
        dateGallery={$dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    {/if}
  </div>
</div>


<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createDateGalleryStore, createActiveListStore } from "@uiloos/svelte";
  import { generateEvents } from "./events";
  import type { EventData } from "./events";
  import { isoFormatter } from "../formatters";
  import type { DateGallery, DateGalleryEvent } from "@uiloos/core";
  import type { DateGalleryMode, DateGalleryConfig } from "@uiloos/core";
  import YearCalendar from "./YearCalendar/YearCalendar.svelte";
  import YearCalendarTitle from "./YearCalendar/YearCalendarTitle.svelte";
  import WeekCalendar from ".//WeekCalendar/WeekCalendar.svelte";
  import WeekCalendarTitle from ".//WeekCalendar/WeekCalendarTitle.svelte";
  import DayCalendar from "./DayCalendar/DayCalendar.svelte";
  import DayCalendarTitle from "./DayCalendar/DayCalendarTitle.svelte";
  import MonthCalendar from "./MonthCalendar/MonthCalendar.svelte";
  import MonthCalendarTitle from "./MonthCalendar/MonthCalendarTitle.svelte";
  import EventForm from "./EventForm/EventForm.svelte";
  import { isValid } from 'date-fns';

  const { mode, numberOfFrames, initialDate } = readConfigFromUrl();

  const dateGallery = createDateGalleryStore({
    mode,
    numberOfFrames,
    initialDate,
    events: generateEvents(),
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

  const modeSegmentedButton = createActiveListStore({
    contents: modeOptions,
    activeIndexes: modeOptions.findIndex(
      (option) => option.mode === mode,
    ),
  });


  // Sync the query parameters, so that the url changes and the
  // user can reload the page and still see the same calendar
  $: syncSearchParams($dateGallery.mode, $dateGallery.firstFrame.anchorDate);
  function syncSearchParams(mode: DateGalleryMode, anchorDate: Date) {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", $dateGallery.mode);
    url.searchParams.set(
      "initialDate",
      isoFormatter.format($dateGallery.firstFrame.anchorDate),
    );

    // Only push if the url has actually changed,
    // otherwise it will push duplicates.
    if (url.href !== window.location.href) {
      window.history.pushState({}, "", url);
      activateMode($dateGallery.mode);
    }
  }

  // Activates a mode and syncs both the dateGallery and modeSegmentedButton (ActiveList)
  // This way no matter how the mode changes, either from inside the dateGallery subscriber
  // or via a button click on the mode segemented button they will always be in sync.
  function activateMode(mode: DateGalleryMode) {
    // Step 1: sync with the segmented button
    $modeSegmentedButton.activateByPredicate((data) => {
      return data.value.mode === mode;
    });

    // Step 2: sync with the DateGallery

    // When the 'mode' is month it means 'year' has been selected
    // and we show 12 month calenders side by side.
    if (mode === "month") {
      // Anchor date to january first, otherwise the 'year' will start
      // at the current month.
      const initialDate = new Date($dateGallery.firstFrame.anchorDate);
      initialDate.setMonth(0);
      initialDate.setDate(1);

      $dateGallery.changeConfig({
        mode,
        numberOfFrames: 12,
        initialDate,
      });
    } else {
      $dateGallery.changeConfig({ mode, numberOfFrames: 1 });
    }
  }

  let showForm = false;
  let formEvent: DateGalleryEvent<EventData> | undefined = undefined;
  let formDate: Date | undefined = undefined;

  function openNewEventForm(date: Date) {
    showForm = true;
    formDate = date;
    formEvent = undefined;
  }

  function openEditEventForm(event: DateGalleryEvent<EventData>) {
    console.log('yo');
    showForm = true;
    formDate = undefined;
    formEvent = event;
  }

  function closeEventForm() {
    showForm = false;
    formEvent = undefined;
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

    $dateGallery.changeConfig(config);

    $modeSegmentedButton.activateByPredicate((data) => {
      return data.value.mode === config.mode;
    });
  };
 
  onMount(() => {
     window.addEventListener("popstate", syncFromUrl);
  });

  onDestroy(() => {
    window.removeEventListener("popstate", syncFromUrl);
  });
</script>

<style>
.calendar-example {
  display: grid;
  gap: 8px;
  font-family: Arial, Helvetica, sans-serif;
}

.calendar-example button {
  cursor: pointer;
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