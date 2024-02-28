<Dialog onClose={onClose}>
  <form class="calendar-event-form" on:submit={onSubmit}>
    <b class="calendar-event-form-title">
      {formEvent ? "Edit event" : "Add event"}
    </b>

    <div class="calendar-event-form-field">
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        value={title}
        on:change={(e) => {
          if (e.target instanceof HTMLInputElement) {
            title = e.target.value;
          }
        }}
      />
    
      {#if titleError}
        <span class="error">{titleError}</span>
      {/if}
    </div>

    <div class="calendar-event-form-field">
      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        cols="4"
        rows="4"
        value={description}
        on:change={(e) => {
          if (e.target instanceof HTMLTextAreaElement) {
            description = e.target.value;
          }
        }}
      ></textarea>
    
      {#if descriptionError}
        <span class="error">{descriptionError}</span>
      {/if}
    </div>

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
        rangeValid = value;
      }}
      startLabel="Start (mm/dd/yyyy hh:mm)"
      endLabel="End (mm/dd/yyyy hh:mm)"
      startErrorLabel="Start"
      endErrorLabel="End"
      required
    />

    <div class="calendar-event-form-field">
      <label for="color">Color</label>
      <input
        id="color"
        name="color"
        type="color"
        value={color}
        on:change={(e) => {
          if (e.target instanceof HTMLInputElement) {
            color = e.target.value;
          }
        }}
      />

      {#if colorError}
        <span class="error">{colorError}</span>
      {/if}
    </div>

    <button type="submit">Save</button>
  </form>

  {#if formEvent}
    <button class="delete-event-button" on:click={deleteButtonClicked}>
      Delete event
    </button>
  {/if}
</Dialog>

<script lang="ts">
  import Dialog from '../../Dialog/Dialog.svelte';
  import { DateGallery, DateGalleryEvent } from "@uiloos/core";
  import { eventId, formatDateForInput } from "./../events";
  import type { EventData} from "./../events";
  import DateRangePicker  from "../../DateRangePicker/DateRangePicker.svelte";

  export let dateGallery: DateGallery<EventData>;
  export let formEvent: DateGalleryEvent<EventData> | undefined = undefined;
  export let formDate: Date | undefined = undefined;
  export let onClose: () => void;

  // Please use a good form library such as Superforms or svelte-forms-lib

  let title = formEvent ? formEvent.data.title : "";
  let titleError = "";

  let description = formEvent ? formEvent.data.description : "";
  let descriptionError = "";

  let startDate = '';
  if (formEvent) {
    startDate = formatDateForInput(formEvent.startDate);
  } else if (formDate) {
    startDate = formatDateForInput(formDate);
  } 
  
  let endDate = '';
  if (formEvent) {
    endDate = formatDateForInput(formEvent.endDate);
  } else if (formDate) {
    const date = new Date(formDate);
    date.setHours(formDate.getHours() + 1, formDate.getMinutes());

    endDate = formatDateForInput(date);
  }

  let rangeValid = false;

  let color = formEvent ? formEvent.data.color : "#000000";
  let colorError = "";

  function onSubmit(e: Event) {
    e.preventDefault();

    let valid = true;

    if (title === "") {
      titleError = "Title is required";
      valid = false;
    } else {
      titleError = "";
    }

    if (description === "") {
      descriptionError = "Description is required";
      valid = false;
    } else {
      descriptionError = "";
    }

    if (color === "") {
      colorError = "Color is required";
      valid = false;
    } else {
      colorError = "";
    }

    if (!rangeValid || !valid) {
      return;
    }

    if (formEvent === undefined) {
      // Inform the dateGallery of the new event
      dateGallery.addEvent({
        data: {
          id: eventId(),
          title,
          description,
          color,
        },
        startDate,
        endDate,
      });
    } else {
      // Inform the dateGallery that the event has changed.

      // First update the data object of the event, to whatever
      // the user filled in.
      formEvent.changeData({
        id: formEvent.data.id,
        title,
        description,
        color,
      });

      // Then tell the DateGallery that the event has actually moved
      formEvent.move({
        startDate,
        endDate,
      });
    }

    onClose();
  }

  function deleteButtonClicked() {
    if (formEvent) {
      formEvent.remove();
      onClose();
    }
  }
</script>

<style>
/* The add / edit event forms */

.calendar-event-form {
  display: grid;
  gap: 8px;
  padding: 8px 0px;
}

.calendar-event-form input {
  border: 1px solid black;
  height: 32px;
  padding: 4px;
}

.error {
  color: red;
}

.calendar-event-form textarea {
  border: 1px solid black;
  padding: 4px;
}

.calendar-event-form button[type="submit"] {
  border: 1px solid black;
  height: 32px;
}

.calendar-event-form .calendar-event-form-field {
  display: grid;
  min-height: 32px;
  gap: 4px;
}

.delete-event-button {
  color: white;
  background-color: #dc2626;
  width: 100%;
  height: 32px;
  cursor: pointer;
}

</style>