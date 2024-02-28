<select
  value={dateGallery.firstFrame.anchorDate.getMonth()}
  on:change={onMonthChanged}
>
  {#each [...Array(12).keys()] as month (month)}
    <option value={month}>
      {monthFormatter.format(new Date(2000, month, 1))}
    </option>
  {/each}
</select>

<script lang="ts">
  import type { DateGallery } from "@uiloos/core";
  import { monthFormatter } from "../formatters";

  export let dateGallery: DateGallery<unknown>;
    
  function onMonthChanged(e: Event) {
    if (e.target instanceof HTMLSelectElement) {      
      const month = parseInt(e.target.value, 10);

      const date = new Date(dateGallery.firstFrame.anchorDate);
      date.setMonth(month);

      dateGallery.changeConfig({ initialDate: date });
    }
  }
</script>

<style>
  select {
     font-size: 16px;
  }
</style>

