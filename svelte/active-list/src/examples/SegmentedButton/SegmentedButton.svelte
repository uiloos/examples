<script lang="ts">
  import { createActiveListStore } from '@uiloos/svelte';
  import type { SegmentedButtonItem } from './types.ts';

  export let buttons: SegmentedButtonItem[];

  const segmentedButtons = createActiveListStore({
    contents: buttons,
    active: buttons.find((button) => button.active),
  });
</script>

<div class="segment-container">
  {#each $segmentedButtons.contents as content (content.index)}
    <button
      on:click={(event) => {
        content.activate();
        content.value.onClick(event);
      }}
      class:active={content.isActive}
    >
      {content.value.label}
    </button>
  {/each}
</div>

<style>
  .segment-container {
    display: flex;
    justify-content: center;
  }

  .segment-container button {
    color: black;
    padding: 8px;
    font-size: 1.2rem;
  }

  .segment-container button.active,
  .segment-container button:hover {
    color: white;
    background-color: black;
  }
</style>
