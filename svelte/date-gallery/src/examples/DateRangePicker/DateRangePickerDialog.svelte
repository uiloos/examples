<Dialog onKeyDown={onKeyDown} onClose={onClose}>
  <div class="daterangepicker-dialog-content">
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
        <li style:grid-column={dateObj.date.getDay() + 1}>
          <button
            aria-label={`Select ${dateFormatter.format(dateObj.date)}`}
            type="button"
            class:selected={dateObj.isSelected}
            class:start-of-range={$dateGallery.isSameDay(rangeStart, dateObj.date)}
            class:end-of-range={$dateGallery.isSameDay(rangeEnd, dateObj.date)}
            disabled={!dateObj.canBeSelected}
            on:click={(event) => onDateClicked(event, dateObj)}
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
      <button type="button" on:click={() => saveAndClose()}>
        Save
      </button>
    </div>
  </div>
</Dialog>

<script lang="ts">
  import { onMount } from 'svelte';
  import { createDateGalleryStore } from "@uiloos/svelte";
  import { parse, isValid } from "date-fns";
  import type { DateGalleryDate } from "@uiloos/core";
  import { dateFormatter } from "../formatters";
  import MonthSelect  from "../Datepicker/MonthSelect.svelte";
  import YearInput from "../Datepicker/YearInput.svelte";
  import Dialog from "../Dialog/Dialog.svelte";
  import { parseAsDate } from '../Datepicker/utils';

  export let startDate: string;
  export let endDate: string;
  export let onChange: (startDate: string, endDate: string) => void;
  export let onClose: () => void;
  export let min: Date | undefined = undefined;
  export let max: Date | undefined = undefined;

  const dateGallery = createDateGalleryStore({
    mode: "month",
    maxSelectionLimit: false,
    canSelect(dateObj) {
      if (min && dateObj.date < min) {
        return false;
      } else if (max && dateObj.date > max) {
        return false;
      }

      return true;
    },
  });

  // Will store the date that was selected first by the user
  let firstSelectedDate: Date | null = null;
  let rangeComplete = false;;
  let keyboardDirection: "earlier" | "later" = "later";
  
  function onDateClicked(
    event: MouseEvent,
    dateObj: DateGalleryDate<unknown>,
  ) {
    // Do not do anthing on "Enter" but let the onKeyDown save and close
    if (event.detail === 0) {
      // detail is the amount of times the mouse was clicked,
      // which is zero for an "Enter" via keyboard.
      return;
    }

    // If the user has not selected any date yet
    if (firstSelectedDate === null) {
      // Store that date that was clicked
      firstSelectedDate = dateObj.date;

      // Treat it as the user wanting to start
      // a new selection on that date.
      $dateGallery.deselectAll();

      // Also visually select this date so it becomes blue.
      $dateGallery.selectDate(firstSelectedDate);

      // Reset so hover animation works again.
      rangeComplete = false;
    } else {
      /*
        If the user has already selected a date the
        second click should close the range.

        Note: selectRange does not care in which order
        it receives the parameters, it will find the
        earlier and later dates itself.
      */
      $dateGallery.selectRange(firstSelectedDate, dateObj.date);

      // Now reset the firstSelectedDate so the next click
      // is treated as the user wanting to change the range
      //again.
      firstSelectedDate = null;

      // Mark the range as complete
      rangeComplete = true;
    }
  }

  function saveAndClose() {
    const [startDate, endDate] = getStartAndEndDateOfSelectedDatesRange();

    onChange(dateFormatter.format(startDate), dateFormatter.format(endDate));

    onClose();
  }

  function onKeyDown(event: KeyboardEvent) {
    // Do not interfere with the year <input>
    if (event.target && event.target instanceof HTMLElement && event.target.nodeName === "INPUT") {
      return;
    }
    
    // Stop the propagation here so not all elements
    // are called for better performance.
    event.stopPropagation();

    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      firstSelectedDate = null;

      // If there is no date selected select the first date
      // that can be selected from the first frame.
      if ($dateGallery.selectedDates.length === 0) {
        const dateObj = $dateGallery.firstFrame.dates.find(
          (dateObj) => dateObj.canBeSelected,
        );

        if (dateObj) {
          // Select the date so it highlights in blue.
          $dateGallery.selectDate(dateObj.date);
        }

        console.timeEnd('keydown');
        return;
      }

      // Base the direction on when the first date of the
      // range is selected. This will also be true when
      // a range is reduced to 1 again.
      if ($dateGallery.selectedDates.length === 1) {
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
          keyboardDirection = "earlier";
        } else {
          keyboardDirection = "later";
        }
      }

      const [rangeStart, rangeEnd] = getStartAndEndDateOfSelectedDatesRange();

      // We want to change the range in the direction
      // the arrow keys go but keep the other date as is.
      let moveDate: Date | null = null;
      let otherDate: Date | null = null;

      if (keyboardDirection === "earlier") {
        moveDate = rangeStart;
        otherDate = rangeEnd;
      } else {
        moveDate = rangeEnd;
        otherDate = rangeStart;
      }

      // Copy last moveDate so the original is
      // not mutated. This is undesirable when the
      // start date is the same as the endDate when
      // the number of moveDate is 1, as the code
      // below would then update them both!
      moveDate = new Date(moveDate);

      // Mutate the moveDate based on the arrow keys
      if (event.key === "ArrowLeft") {
        moveDate.setDate(moveDate.getDate() - 1);
      } else if (event.key === "ArrowRight") {
        moveDate.setDate(moveDate.getDate() + 1);
      } else if (event.key === "ArrowUp") {
        moveDate.setDate(moveDate.getDate() - 7);
      } else if (event.key === "ArrowDown") {
        moveDate.setDate(moveDate.getDate() + 7);
      }
      
      // Select the date so it highlights in blue.
      $dateGallery.deselectAll();
      $dateGallery.selectRange(moveDate, otherDate);
      

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months when month changes
      if (
        moveDate.getMonth() !== $dateGallery.firstFrame.anchorDate.getMonth()
      ) {
        $dateGallery.changeConfig({ initialDate: moveDate });
      }
    } else if (event.key === "Enter") {
      // When enter is pressed close the dialog and set
      // the value to the selected date.
      saveAndClose();
    }
  }

  function getStartAndEndDateOfSelectedDatesRange() {
    // Sort from past to future.
    const sorted = [...$dateGallery.selectedDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    // The first date is the start date.
    const start = sorted[0] ?? new Date();

    // The last date is the end date
    const end = sorted[sorted.length - 1] ?? new Date();

    return [start, end];
  }

  let rangeStart = new Date();
  let rangeEnd = new Date();
 
  $: rangeChanged($dateGallery.selectedDates.at(0), $dateGallery.selectedDates.at(-1));

  function rangeChanged(start: Date | undefined, end: Date | undefined) {
    const [newRangeStart, newRangeEnd] = getStartAndEndDateOfSelectedDatesRange();

    rangeStart = newRangeStart;
    rangeEnd = newRangeEnd;
  }

  onMount(() => {
     // If there is already a selection reselect it.
    if (startDate && endDate) {
      const start = parseAsDate(startDate);
      const end = parseAsDate(endDate);

      if (isValid(start) && isValid(end)) {
        $dateGallery.changeConfig({ initialDate: end as Date });
        $dateGallery.selectRange(start as Date, end as Date);
      }
    }
 });

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

.daterangepicker-dialog-content {
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

.dates .selected {
  background-color: skyblue;
  font-weight: bold;
}

.dates .start-of-range {
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
}

.dates .end-of-range {
  border-top-right-radius: 100%;
  border-bottom-right-radius: 100%;
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