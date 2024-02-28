<input
  value={year}
  on:change={(e) => {
    if (e.target instanceof HTMLInputElement) {
      year = e.target.value;
    }
  }}
  on:keyup={(e) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      onYearInputChanged(e.target.value);
    }
  }}
  on:blur={(e) => {
    if (e.target instanceof HTMLInputElement) {
      onYearInputChanged(e.target.value);
    }
  }}
/>

<script lang="ts">
  import type { DateGallery } from "@uiloos/core";
  import { onMount } from 'svelte';

  export let dateGallery: DateGallery<unknown>;
    
  let year: string = new Date().getFullYear().toString();

  function onYearInputChanged(value: string) {
    let newYear = parseInt(value, 10);

    if (isNaN(newYear)) {
        newYear = new Date().getFullYear();
        year = newYear.toString();
    }

    const date = new Date(
        newYear,
        dateGallery.firstFrame.anchorDate.getMonth(),
        dateGallery.firstFrame.anchorDate.getDate(),
    );

    dateGallery.changeConfig({ initialDate: date });
  }

   $: updateYear(dateGallery.firstFrame.anchorDate.getFullYear());

   function updateYear(newYear: number) {
     year = newYear.toString();
   }

   onMount(() => {
    year = dateGallery.firstFrame.anchorDate.getFullYear().toString();
  });

</script>

<style>
  input {
    border: solid 1px black;
    padding: 4px;
    width: 42px;
  }
</style>