<div class="datepicker">
  <div class="datepicker-input-wrapper">
    <input
      type="text"
      class="date"
      value={inputValue}
      on:change={(e) => {
        if (e.target instanceof HTMLInputElement) {
          inputValue = e.target.value
        }
      }}
      on:blur={(e) => {
        if (e.target instanceof HTMLInputElement) {
          dateChanged(e.target.value)}
        }
      }
      placeholder="06/31/2000"
    />
    
    {#if timeEnabled}
      <input
        type="text"
        class="time"
        placeholder="12:30"
        value={timeValue}
        on:change={(e) => {
          if (e.target instanceof HTMLInputElement) {
            timeValue = e.target.value
          }
        }}
        on:blur={(e) => {
          if (e.target instanceof HTMLInputElement) {
            timeChanged(e.target.value);
          }
        }}
      />
    {/if}
        
    <button
      aria-label="Open calendar"
      class="calendar-button"
      type="button"
      on:click={onCalendarButtonClicked}
    >
      📅
    </button>
  </div>

  {#if error}
    <span class="error">{error}</span>
  {/if}

  {#if showDialog}
    <DatepickerDialog
      value={value}
      onChange={dateChanged}
      onClose={() => {
        showDialog = false
      }}
      min={minDate ?? undefined}
      max={maxDate ?? undefined}
    />
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { DateGallery } from "@uiloos/core";
  import DatepickerDialog from "./DatepickerDialog.svelte";
  import { dateFormatter, timeFormatter } from "../formatters";
  import { isValid } from "date-fns";
  import { parseAsDate } from "./utils";

  export let value: string;
  export let onChange: (value: string) => void;
  export let onValidityChanged: (valid: boolean) => void;
  export let required: boolean | undefined = undefined;
  export let min: string | undefined = undefined;
  export let max: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let timeEnabled: boolean | undefined = undefined;
  export let onOpenDialog: (() => void) | undefined = undefined;

  export let linkedPicker: {
    value: string;
    label: string;
    myPosition: "start" | "end";
  } | undefined = undefined;
    
  let showDialog = false;
  let error = "";

  let inputValue = "";
  let timeValue = "";

  function dateChanged(date: string) {
    if (date === "") {
      onChange("");
      return;
    }

    // This allows the user to enter "today" / "tomorrow" and "yesterday"
    // and get it transformed back to a date.
    if (["today", "tomorrow", "yesterday"].includes(date)) {
      date = dateFormatter.format(parseAsDate(date) as Date);
    }

    if (timeEnabled) {
      let _timeValue = timeValue;

      if (!_timeValue) {
        _timeValue = "00:00";
      }

      timeValue = _timeValue;

      onChange(`${date} ${_timeValue}`);
    } else {
      onChange(date + " 00:00");
    }
  }

  function timeChanged(newTime: string) {
    timeValue = newTime;

    onChange(`${inputValue} ${timeValue}`);
  }

  function onCalendarButtonClicked() {
    // If there is a callback call it, otherwise
    // open our dialog
    if (onOpenDialog) {
      onOpenDialog();
    } else {
      showDialog = !showDialog;
    }
  }

  let minDate = parseAsDate(min);
  let maxDate = parseAsDate(max);

  $: sync(min, max);

  function sync(min: string | undefined, max: string | undefined) {
    minDate = parseAsDate(min);
    maxDate = parseAsDate(max);
  }

  function validate(value: string, linkedPickerValue: string | undefined) {
    const date = parseAsDate(value);

    if (date && isValid(date)) {
      inputValue = dateFormatter.format(date);
      timeValue = timeFormatter.format(date);

      onChange(`${inputValue} ${timeValue}`);
    }

    // If it is required but empty report an error
    if (required && value === "") {
      error = `${label} is required`;
      onValidityChanged(false);
      return;
    }

    // If it is not required and the value is empty mark as valid
    if (!required && value === "") {
      error = "";
      onValidityChanged(true);

      return;
    }

    // Check if it is indeed valid
    if (!isValid(date)) {
      const format = timeEnabled ? "mm/dd/yyyy hh:mm" : "mm/dd/yyyy";

      error = `${label} is not a valid date in the ${format} format`;
      onValidityChanged(false);

      return;
    }

    if (date) {
      if (minDate && date < minDate) {
        error = `${label} must be after ${dateFormatter.format(minDate)}`;
        onValidityChanged(false);

        return;
      }

      if (maxDate && date > maxDate) {
        error = `${label} must be before ${dateFormatter.format(maxDate)}`;
        onValidityChanged(false);

        return;
      }

      if (linkedPicker) {
        const linkedPickerDate = parseAsDate(linkedPicker.value);

        if (linkedPickerDate) {
          // If we are in a range picker relation and we are the start we must not be after the end.
          if (linkedPicker.myPosition === "start" && date > linkedPickerDate) {
            error = `${label} lies after ${linkedPicker.label}`;

            onValidityChanged(false);
            return;
          }

          // If we are in a range picker relation and we are the end we must not be before the start.
          if (linkedPicker.myPosition === "end" && date < linkedPickerDate) {
            error = `${label} lies before ${linkedPicker.label}`;
            onValidityChanged(false);

            return;
          }
        }
      }
    }

    error = "";
    onValidityChanged(true);
  }

  $: validate(value, linkedPicker?.value);

  onMount(() => {
    validate(value, linkedPicker?.value);
  });
</script>

<style>
.datepicker {
  display: grid;
  gap: 4px;
}

.datepicker .datepicker-input-wrapper {
  display: flex;
  gap: 4px;
  align-content: center;
}

.datepicker input {
  border: solid 1px black;
  padding: 4px;
}

.datepicker input.date {
  flex-grow: 1;
}

.datepicker input.time {
  min-width: 50px;
  flex-basis: 0;
}

.datepicker.invalid input.date .datepicker.invalid input.time {
  border: solid 1px red;
}

.datepicker .error {
  color: red;
}

.datepicker .calendar-button {
  background-color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>