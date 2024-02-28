<template>
  <div class="center">
    <div id="vacationForm">
      <span>Request vacation</span>

      <DateRangePicker
        timeEnabled
        v-model:start="startDate"
        v-model:end="endDate"
        @validityChanged="
          (value: boolean) => {
            vacationIsValid = value;
          }
        "
        startLabel="From (mm/dd/yyyy)"
        endLabel="Till (mm/dd/yyyy)"
        startErrorLabel="From"
        endErrorLabel="Till"
        required
        min="yesterday"
      />

      <p v-if="startDate && endDate && vacationIsValid">
        Your vacation starts on: {{ startDate }} and ends on {{ endDate }}
      </p>
    </div>
  </div>

  <div class="description">
    <p>
      The example above shows a date range picker component which is implemented
      as a custom element which ties two datepickers from the "Datepicker"
      example together.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DateRangePicker from "./DateRangePicker.vue";

let startDate = ref("01/01/2040 23:00");
let endDate = ref("01/07/2040 23:00");
let vacationIsValid = ref(true);
</script>

<style scoped>
#vacationForm {
  display: grid;
  gap: 8px;
  width: 300px;
}
</style>
