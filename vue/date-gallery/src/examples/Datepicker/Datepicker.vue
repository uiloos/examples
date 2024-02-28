<template>
  <div class="datepicker">
    <div class="datepicker-input-wrapper">
      <input
        type="text"
        class="date"
        :value="inputValue"
        @input="($event) => inputValueChanged($event)"
        @blur="($event) => dateChanged()"
        placeholder="06/31/2000"
      />

      <input
        v-if="timeEnabled"
        type="text"
        class="time"
        placeholder="12:30"
        :value="timeValue"
        @input="($event) => timeValueChanged($event)"
        @blur="($event) => timeChanged()"
      />

      <button
        aria-label="Open calendar"
        class="calendar-button"
        type="button"
        @click="onCalendarButtonClicked()"
      >
        📅
      </button>
    </div>

    <span v-if="error" class="error">{{ error }}</span>

    <DatepickerDialog
      v-if="showDialog"
      :value="inputValue"
      @change="(date: string) => datePicked(date)"
      @close="
        () => {
          showDialog = false;
        }
      "
      :min="minDate ?? undefined"
      :max="maxDate ?? undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import DatepickerDialog from "./DatepickerDialog.vue";
import { dateFormatter, timeFormatter } from "../formatters";
import { isValid } from "date-fns";
import { parseAsDate } from "./utils";

interface Props {
  required?: boolean;
  min?: string;
  max?: string;
  label: string;
  timeEnabled?: boolean;

  customDialog?: boolean;

  linkedPicker?: {
    value: string;
    label: string;
    myPosition: "start" | "end";
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "validityChanged", value: boolean): void;
  (e: "openDialog"): void;
}>();

let showDialog = ref(false);
let error = ref("");

const model = defineModel<string>();

let inputValue = ref("");
let timeValue = ref("");

function datePicked(value: string) {
  inputValue.value = value;
  dateChanged();
}

function inputValueChanged(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    inputValue.value = event.target.value;
  }
}

function timeValueChanged(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    timeValue.value = event.target.value;
  }
}

function dateChanged() {
  let date = inputValue.value;

  if (date === "") {
    inputValue.value = "";
    return;
  }

  // This allows the user to enter "today" / "tomorrow" and "yesterday"
  // and get it transformed back to a date.
  if (["today", "tomorrow", "yesterday"].includes(date)) {
    date = dateFormatter.format(parseAsDate(date) as Date);
  }

  if (props.timeEnabled) {
    let _timeValue = timeValue.value;

    if (!_timeValue) {
      _timeValue = "00:00";
    }

    timeValue.value = _timeValue;

    model.value = `${date} ${_timeValue}`;
  } else {
    model.value = date + " 00:00";
  }
}

function timeChanged() {
  model.value = `${inputValue.value} ${timeValue.value}`;
}

function onCalendarButtonClicked() {
  // If there is a callback call it, otherwise
  // open our dialog
  if (props.customDialog) {
    emit("openDialog");
  } else {
    showDialog.value = !showDialog.value;
  }
}

let minDate = parseAsDate(props.min);
let maxDate = parseAsDate(props.max);

watch(
  () => props.min,
  () => {
    minDate = parseAsDate(props.min);
  },
);

watch(
  () => props.max,
  () => {
    maxDate = parseAsDate(props.max);
  },
);

function validate() {
  const date = parseAsDate(model.value);

  if (date && isValid(date)) {
    inputValue.value = dateFormatter.format(date);
    timeValue.value = timeFormatter.format(date);

    model.value = `${inputValue.value} ${timeValue.value}`;
  }

  // If it is required but empty report an error
  if (props.required && model.value === "") {
    error.value = `${props.label} is required`;
    emit("validityChanged", false);
    return;
  }

  // If it is not required and the value is empty mark as valid
  if (!props.required && model.value === "") {
    error.value = "";
    emit("validityChanged", true);

    return;
  }

  // Check if it is indeed valid
  if (!isValid(date)) {
    const format = props.timeEnabled ? "mm/dd/yyyy hh:mm" : "mm/dd/yyyy";

    error.value = `${props.label} is not a valid date in the ${format} format`;
    emit("validityChanged", false);

    return;
  }

  if (date) {
    if (minDate && date < minDate) {
      error.value = `${props.label} must be after ${dateFormatter.format(minDate)}`;
      emit("validityChanged", false);

      return;
    }

    if (maxDate && date > maxDate) {
      error.value = `${props.label} must be before ${dateFormatter.format(maxDate)}`;
      emit("validityChanged", false);

      return;
    }

    if (props.linkedPicker) {
      const linkedPickerDate = parseAsDate(props.linkedPicker.value);

      if (linkedPickerDate) {
        // If we are in a range picker relation and we are the start we must not be after the end.
        if (
          props.linkedPicker.myPosition === "start" &&
          date > linkedPickerDate
        ) {
          error.value = `${props.label} lies after ${props.linkedPicker.label}`;

          emit("validityChanged", false);
          return;
        }

        // If we are in a range picker relation and we are the end we must not be before the start.
        if (
          props.linkedPicker.myPosition === "end" &&
          date < linkedPickerDate
        ) {
          error.value = `${props.label} lies before ${props.linkedPicker.label}`;
          emit("validityChanged", false);

          return;
        }
      }
    }
  }

  error.value = "";
  emit("validityChanged", true);
}

// Validate at least once on mount.
onMounted(validate);

// Validate whenever the model changes
watch(model, validate);

// When the linkedPicker changes also validate this picker
if (props.linkedPicker) {
  watch(
    () => {
      return props?.linkedPicker?.value;
    },
    () => {
      validate();
    },
  );
}
</script>

<style scoped>
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
