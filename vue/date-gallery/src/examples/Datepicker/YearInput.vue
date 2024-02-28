<template>
  <input v-model="year" @blur="($event) => onYearInputChanged($event)" />
</template>

<script setup lang="ts">
import { DateGallery } from "@uiloos/core";
import { onMounted, watch } from "vue";

interface Props {
  dateGallery: DateGallery<unknown>;
}

const props = defineProps<Props>();

let year = new Date().getFullYear();

function onYearInputChanged(event: FocusEvent) {
  if (event.target instanceof HTMLInputElement) {
    const value = event.target.value;

    let newYear = parseInt(value, 10);

    if (isNaN(newYear)) {
      newYear = new Date().getFullYear();
      year = newYear;
    }

    const date = new Date(
      year,
      props.dateGallery.firstFrame.anchorDate.getMonth(),
      props.dateGallery.firstFrame.anchorDate.getDate(),
    );

    props.dateGallery.changeConfig({ initialDate: date });
  }
}

// Whenever the year changes update the year, happens
// when user uses next and previous buttons.
watch(
  () => props.dateGallery.firstFrame.anchorDate.getFullYear(),
  () => {
    year = props.dateGallery.firstFrame.anchorDate.getFullYear();
  },
);

// Set initial year
onMounted(() => {
  year = props.dateGallery.firstFrame.anchorDate.getFullYear();
});
</script>

<style scoped>
input {
  border: solid 1px black;
  padding: 4px;
  width: 42px;
}
</style>
