<template>
  <div class="daterangepicker">
    <label>
      {{ startLabel }}:
      <Datepicker
        v-model="startModel"
        @validityChanged="(value: boolean) => onStartValidityChanged(value)"
        :timeEnabled="timeEnabled"
        :label="startErrorLabel"
        :min="min"
        :max="max"
        :required="required"
        :custom-dialog="true"
        @open-dialog="
          () => {
            showDialog = true;
          }
        "
        :linkedPicker="{
          label: endErrorLabel,
          value: endModel ?? '',
          myPosition: 'start',
        }"
      />
    </label>

    <label>
      {{ endLabel }}:
      <Datepicker
        v-model="endModel"
        @validityChanged="(value: boolean) => onEndValidityChanged(value)"
        :timeEnabled="timeEnabled"
        :label="endErrorLabel"
        :min="min"
        :max="max"
        :required="required"
        :custom-dialog="true"
        @open-dialog="
          () => {
            showDialog = true;
          }
        "
        :linkedPicker="{
          label: startErrorLabel,
          value: startModel ?? '',
          myPosition: 'end',
        }"
      />
    </label>

    <DateRangePickerDialog
      v-if="showDialog"
      :startDate="startModel ?? ''"
      :endDate="endModel ?? ''"
      @change="(start: string, end: string) => rangeChanged(start, end)"
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
import { ref } from "vue";
import Datepicker from "../Datepicker/Datepicker.vue";
import DateRangePickerDialog from "./DateRangePickerDialog.vue";
import { parseAsDate } from "../Datepicker/utils";
import { timeFormatter } from "../formatters";
import { isValid } from "date-fns";

type Props = {
  startLabel?: string;
  startErrorLabel?: string;

  endLabel?: string;
  endErrorLabel?: string;

  required?: boolean;
  min?: string;
  max?: string;

  timeEnabled?: boolean;
};

const startModel = defineModel<string>("start");
const endModel = defineModel<string>("end");

const emit = defineEmits<{
  (e: "validityChanged", value: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  endLabel: "End",
  endErrorLabel: "End",

  startLabel: "Start",
  startErrorLabel: "Start",
});

let showDialog = ref(false);
let startDateIsValid = ref(true);
let endDateIsValid = ref(true);
let minDate = parseAsDate(props.min);
let maxDate = parseAsDate(props.max);

function onStartValidityChanged(valid: boolean) {
  startDateIsValid.value = valid;

  emit("validityChanged", startDateIsValid.value && endDateIsValid.value);
}

function onEndValidityChanged(valid: boolean) {
  endDateIsValid.value = valid;

  emit("validityChanged", startDateIsValid.value && endDateIsValid.value);
}

function rangeChanged(start: string, end: string) {
  if (props.timeEnabled) {
    const startTime = getTimeOfDate(startModel.value ?? "");
    const endTime = getTimeOfDate(endModel.value ?? "");

    startModel.value = `${start} ${startTime}`;
    endModel.value = `${end} ${endTime}`;
  } else {
    startModel.value = start;
    endModel.value = end;
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

<style scoped>
.daterangepicker {
  display: grid;
  gap: 4px;
}

.daterangepicker .calendar-button {
  background-color: white;
  font-size: 16px;
  cursor: pointer;
}

button {
  cursor: pointer;
}
</style>
