<template>
  <div class="center">
    <div id="birthdayForm">
      <label for="birthday"> Birthday (mm/dd/yyyy) </label>
      <Datepicker
        v-model="birthday"
        @validityChanged="
          (value: boolean) => {
            birthdayIsValid = value;
          }
        "
        required
        min="01/01/1900"
        max="tomorrow"
        label="Birthday"
      />

      <label for="appointment"> Appointment (mm/dd/yyyy hh:mm) </label>
      <Datepicker
        v-model="appointment"
        @validityChanged="
          (value: boolean) => {
            appointmentIsValid = value;
          }
        "
        label="Appointment"
        required
        min="yesterday"
        timeEnabled
      />

      <p
        v-if="birthday && appointment && birthdayIsValid && appointmentIsValid"
      >
        Your birthday is: {{ birthday }} your appointment is on
        {{ appointment }}
      </p>
    </div>
  </div>

  <div class="description">
    <p>
      The example above shows a datepicker component which is implemented as a
      custom element that integrates with regular HTML form elements.
    </p>

    <p>
      It does this by creating a web component which has the "formAssociated"
      static property set to true.
    </p>

    <p>
      Tip: try entering "today" or "yesterday" or "tomorrow" in the inputs
      without the quotes!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Datepicker from "./Datepicker.vue";

let birthday = ref("");
let appointment = ref("");

let birthdayIsValid = ref(false);
let appointmentIsValid = ref(false);
</script>

<style scoped>
#birthdayForm {
  display: grid;
  gap: 8px;
  width: 300px;
}
</style>
