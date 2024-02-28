<div class="center">
  <div id="vacationForm">
    <span>Request vacation</span>

    <DateRangePicker
      timeEnabled
      startValue={startDate}
      onStartChanged={(value) => {
        startDate = value;
      }}
      endValue={endDate}
      onEndChanged={(value) => {
        endDate = value;
      }}
      validityChanged={(value) => {
        vacationIsValid = value;
      }}
      startLabel="From (mm/dd/yyyy)"
      endLabel="Till (mm/dd/yyyy)"
      startErrorLabel="From"
      endErrorLabel="Till"
      required
      min="yesterday"
    />

    {#if startDate && endDate && vacationIsValid} 
      <p>
        Your vacation starts on: {startDate} and ends on {endDate}
      </p>
    {/if}
  </div>
</div>

<div class="description">
  <p>
    The example above shows a date range picker component which is
    implemented as a custom element which ties two datepickers from the
    "Datepicker" example together.
  </p>
</div>

<script lang="ts">
  import DateRangePicker from "./DateRangePicker.svelte";

  let startDate = "01/01/2040 23:00"
  let endDate = "01/07/2040 23:00"
  let vacationIsValid = true
</script>

<style>
#vacationForm {
  display: grid;
  gap: 8px;
  width: 300px;
}
</style>