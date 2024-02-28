<template>
  <Dialog
    @close="
      {
        emit('close');
      }
    "
  >
    <form class="calendar-event-form" @submit="($event) => onSubmit($event)">
      <b class="calendar-event-form-title">
        {{ formEvent ? "Edit event" : "Add event" }}
      </b>

      <div class="calendar-event-form-field">
        <label for="title">Title</label>
        <input id="title" name="title" v-model="title" />

        <span v-if="titleError" class="error">{{ titleError }}</span>
      </div>

      <div class="calendar-event-form-field">
        <label for="description">Description</label>
        <textarea
          id="description"
          name="description"
          cols="4"
          rows="4"
          v-model="description"
        ></textarea>

        <span v-if="descriptionError" class="error">{{
          descriptionError
        }}</span>
      </div>

      <DateRangePicker
        timeEnabled
        v-model:start="startDate"
        v-model:end="endDate"
        @validityChanged="
          (value: boolean) => {
            rangeValid = value;
          }
        "
        startLabel="Start (mm/dd/yyyy hh:mm)"
        endLabel="End (mm/dd/yyyy hh:mm)"
        startErrorLabel="Start"
        endErrorLabel="End"
        required
      />

      <div class="calendar-event-form-field">
        <label for="color">Color</label>
        <input id="color" name="color" type="color" v-model="color" />

        <span v-if="colorError" class="error">{{ colorError }}</span>
      </div>

      <button type="submit">Save</button>
    </form>

    <button
      v-if="formEvent"
      class="delete-event-button"
      @click="($event) => deleteButtonClicked()"
    >
      Delete event
    </button>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../../Dialog/Dialog.vue";
import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import { eventId, formatDateForInput } from "./../events";
import type { EventData } from "./../events";
import DateRangePicker from "../../DateRangePicker/DateRangePicker.vue";

interface Props {
  dateGallery: DateGallery<EventData>;
  formEvent: DateGalleryEvent<EventData> | undefined;
  formDate?: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (e: "close"): void }>();

// Please use a good form library such as FormKit, VeeValidate or VueForm

let title = ref(props.formEvent ? props.formEvent.data.title : "");
let titleError = ref("");

let description = ref(props.formEvent ? props.formEvent.data.description : "");
let descriptionError = ref("");

let startDate = ref("");
if (props.formEvent) {
  startDate.value = formatDateForInput(props.formEvent.startDate);
} else if (props.formDate) {
  startDate.value = formatDateForInput(props.formDate);
}

let endDate = ref("");
if (props.formEvent) {
  endDate.value = formatDateForInput(props.formEvent.endDate);
} else if (props.formDate) {
  const date = new Date(props.formDate);
  date.setHours(props.formDate.getHours() + 1, props.formDate.getMinutes());

  endDate.value = formatDateForInput(date);
}

let rangeValid = ref(false);

let color = ref(props.formEvent ? props.formEvent.data.color : "#000000");
let colorError = ref("");

function onSubmit(e: Event) {
  e.preventDefault();

  let valid = true;

  if (title.value === "") {
    titleError.value = "Title is required";
    valid = false;
  } else {
    titleError.value = "";
  }

  if (description.value === "") {
    descriptionError.value = "Description is required";
    valid = false;
  } else {
    descriptionError.value = "";
  }

  if (color.value === "") {
    colorError.value = "Color is required";
    valid = false;
  } else {
    colorError.value = "";
  }

  if (!rangeValid || !valid) {
    return;
  }

  const isCreating = props.formEvent === undefined;

  if (isCreating) {
    // Inform the dateGallery of the new event
    props.dateGallery.addEvent({
      data: {
        id: eventId(),
        title: title.value,
        description: description.value,
        color: color.value,
      },
      startDate: startDate.value,
      endDate: endDate.value,
    });
  } else {
    // Inform the dateGallery that the event has changed.

    // First update the data object of the event, to whatever
    // the user filled in.
    props.formEvent.changeData({
      id: props.formEvent.data.id,
      title: title.value,
      description: description.value,
      color: color.value,
    });

    // Then tell the DateGallery that the event has actually moved
    props.formEvent.move({
      startDate: startDate.value,
      endDate: endDate.value,
    });
  }

  emit("close");
}

function deleteButtonClicked() {
  if (props.formEvent) {
    props.formEvent.remove();
    emit("close");
  }
}
</script>

<style scoped>
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
}
</style>
