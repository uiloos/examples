<Dialog onKeyDown={onKeyDown} onClose={onClose}>
  <div class="datepicker-dialog-content">
    <div class="topbar">
      <button
        aria-label="previous"
        type="button"
        on:click={() => $dateGallery.previous()}
      >
        ‹
      </button>
      <span>
        <MonthSelect dateGallery={$dateGallery} />
        <YearInput dateGallery={$dateGallery} />
      </span>
      <button
        aria-label="next"
        type="button"
        on:click={() => $dateGallery.next()}
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
      {#each $dateGallery.firstFrame.dates as dateObj (dateObj.date.toISOString())}
        <li
          style:grid-column={dateObj.date.getDay() + 1}
        >
          <button
            aria-label={`Select ${dateFormatter.format(dateObj.date)}`}
            type="button"
            class:selected={dateObj.isSelected}
            class:today={dateObj.isToday}
            disabled={!dateObj.canBeSelected}
            on:click={() => onDateClicked(dateObj)}
          >
            <time dateTime={dateObj.date.toISOString()}>
              {dateObj.date.getDate()}
            </time>
          </button>
        </li>
      {/each}
    </ul>

    <div class="bottombar">
      <button type="button" on:click={() => onClose()}>
        Cancel
      </button>
      <button type="button" on:click={() => $dateGallery.today()}>
        Today
      </button>
    </div>
  </div>
</Dialog>

<script lang="ts">
  import { createDateGalleryStore } from "@uiloos/svelte";
  import { parse, isValid } from "date-fns";
  import type { DateGalleryDate } from "@uiloos/core";
  import { dateFormatter } from "../formatters";
  import MonthSelect  from "./MonthSelect.svelte";
  import YearInput from "./YearInput.svelte";
  import Dialog from "../Dialog/Dialog.svelte";
  import { parseAsDate } from './utils'

  export let value: string;
  export let onChange: (value: string) => void;
  export let onClose: () => void;
  export let min: Date | undefined = undefined;
  export let max: Date | undefined = undefined;

  let dialog: HTMLDialogElement | null = null;

  let initialDate = new Date();
  if (value) {
    const date = parseAsDate(value);

    if (isValid(date)) {
      initialDate = date as Date;
    }
  }

  const dateGallery = createDateGalleryStore({
    mode: "month",
    initialDate,
    selectedDates: [initialDate],
    maxSelectionLimit: 1,
    
    canSelect(dateObj) {
      if (min && dateObj.date < min) {
        return false;
      } else if (max && dateObj.date > max) {
        return false;
      }

      return true;
    },
  });

  function onDateClicked(dateObj: DateGalleryDate<unknown>) {
    const date = dateFormatter.format(dateObj.date);
    onChange(date);
    onClose();
  }

  function onKeyDown(event: KeyboardEvent) {
    // Do not interfere with the year <input>
    if (event.target instanceof HTMLElement && event.target.nodeName === "INPUT") {
      return;
    }

    // Stop the propagation here so not all elements
    // are called for better performance.
    event.stopPropagation();

    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      // Copy date as not to mutate the selected date.
      const date = new Date($dateGallery.selectedDates[0]);

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
      $dateGallery.selectDate(date);

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months.
      $dateGallery.changeConfig({ initialDate: date });
    } else if (event.key === "Enter") {
      // When enter is pressed close the dialog and set
      // the value to the selected date.

      // We do not want the dialog to open again.
      event.preventDefault();

      const date = dateFormatter.format($dateGallery.selectedDates[0]);

      onChange(date);
      onClose();
    }
  }
</script>

<style>
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