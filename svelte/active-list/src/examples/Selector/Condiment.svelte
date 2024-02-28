<script lang="ts">
  import type { ActiveListContent } from '@uiloos/core';
  import type { Condiment as CondimentType } from './types';

  export let content: ActiveListContent<CondimentType>;
</script>

<button
  class="condiment"
  class:selected={content.isActive}
  on:click={() => content.toggle()}
>
  <h4>{content.value.name}</h4>
  <p>{content.value.description}</p>
  <b>${content.value.price}</b>
</button>

<style>
  .condiment {
    width: 200px;
    border: blue 1px solid;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: white;
    cursor: pointer;
  }

  .condiment p {
    text-align: left;
  }

  .condiment.selected {
    background-color: lightblue;
  }
</style>
