<div class="daterangepicker">
  <label>
    {startLabel}:
    <Datepicker
      value={startValue}
      timeEnabled={timeEnabled}
      label={startErrorLabel}
      onChange={onStartChanged}
      min={min}
      max={max}
      required={required}
      onValidityChanged={onStartValidityChanged}
       onOpenDialog={() => {
        showDialog = true;
      }}
      linkedPicker={{
        label: endErrorLabel,
        value: endValue,
        myPosition: "start",
      }}
    />
  </label>

  <label>
    {endLabel}:
    <Datepicker
      value={endValue}
      timeEnabled={timeEnabled}
      label={endErrorLabel}
      onChange={onEndChanged}
      min={min}
      max={max}
      required={required}
      onValidityChanged={onEndValidityChanged}
      onOpenDialog={() => {
        showDialog = true;
      }}
      linkedPicker={{
        label: startErrorLabel,
        value: startValue,
        myPosition: "end",
      }}
    />
  </label>

 {#if showDialog}
    <DateRangePickerDialog
      startDate={startValue}
      endDate={endValue}
      onChange={rangeChanged}
      onClose={() => {
        showDialog = false
      }}
      min={minDate ?? undefined}
      max={maxDate ?? undefined}
    />
  {/if}
</div>

<script lang="ts">
  import Datepicker  from "../Datepicker/Datepicker.svelte";
  import  DateRangePickerDialog from "./DateRangePickerDialog.svelte";
  import { parseAsDate } from "../Datepicker/utils";
  import { timeFormatter } from "../formatters";
  import { isValid } from "date-fns";

  export let startValue: string;
  export let onStartChanged: (value: string) => void;
  export let startLabel = "Start";
  export let startErrorLabel = "Start";

  export let endValue: string;
  export let onEndChanged: (value: string) => void;

  export let endLabel = "End";
  export let endErrorLabel = "End";

  export let required: boolean | undefined = undefined;
  export let min: string | undefined = undefined;
  export let max: string | undefined = undefined;

  export let timeEnabled: boolean | undefined = undefined;

  export let validityChanged: (valid: boolean) => void;

  let showDialog = false;
  let startDateIsValid = true;
  let endDateIsValid = true;
  let minDate = parseAsDate(min);
  let maxDate = parseAsDate(max);

  function onStartValidityChanged(valid: boolean) {
    startDateIsValid = valid;

    validityChanged(startDateIsValid && endDateIsValid);
  }

  function onEndValidityChanged(valid: boolean) {
    endDateIsValid = valid;

    validityChanged(startDateIsValid && endDateIsValid);
  }

  function rangeChanged(start: string, end: string) {
    if (timeEnabled) {
      const startTime = getTimeOfDate(startValue);
      const endTime = getTimeOfDate(endValue);

      onStartChanged(`${start} ${startTime}`);
      onEndChanged(`${end} ${endTime}`);
    } else {
      onStartChanged(start);
      onEndChanged(end);
    }
  }

  function getTimeOfDate(date: string) {
    let time = parseAsDate(date);

    if (isValid(time)) {
      return timeFormatter.format(time as Date);
    } else {
      return "00:00";
    }
  }
</script>

<style>
.daterangepicker {
  display: grid;
  gap: 4px;
}
</style>