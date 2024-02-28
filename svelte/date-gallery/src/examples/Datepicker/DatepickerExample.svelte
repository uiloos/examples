<div class="center">
  <div id="birthdayForm">
    <label for="birthday"> Birthday (mm/dd/yyyy) </label>
    <Datepicker
      value={birthday}
      onChange={(value) => { 
        birthday = value;
      }}
      onValidityChanged={(value) => {
        birthdayIsValid = value;
      }}
      required
      min="01/01/1900"
      max="tomorrow"
      label="Birthday"
    />

    <label for="appointment"> Appointment (mm/dd/yyyy hh:mm) </label>
    <Datepicker
      value={appointment}
       onChange={(value) => { 
        appointment = value
      }}
      onValidityChanged={(value) => {
        appointmentIsValid = value
      }}
      label="Appointment"
      required
      min="yesterday"
      timeEnabled
    />

    {#if birthday && appointment && birthdayIsValid && appointmentIsValid}
      <p>Your birthday is: {birthday} your appointment is on {appointment}</p>
    {/if}
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
    Tip: try entering "today" or "yesterday" or "tomorrow" in the inputs without
    the quotes!
  </p>
</div>

<script lang="ts">
  import Datepicker from "./Datepicker.svelte";

  let birthday = '';
  let birthdayIsValid = false;
  let appointment = "today";
  let appointmentIsValid = false;
</script>

<style>
#birthdayForm {
  display: grid;
  gap: 8px;
  width: 300px;
}
</style>