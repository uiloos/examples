<script context="module">
  export const TABS = 'tabs';
  export const TABS_ACTIVE = 'tabs_active';
</script>

<script lang="ts">
  import { createActiveListStore } from '@uiloos/svelte';
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { TabInfo } from './types';

  const tabs = createActiveListStore<TabInfo>({ contents: [] });
  setContext(TABS, $tabs);

  let activeHref = writable('');
  setContext(TABS_ACTIVE, activeHref);

  $: $activeHref = $tabs.lastActivated?.href ?? '';

  onMount(() => {
    // Activate the first tab if no hash is available.
    if (!window.location.hash) {
      $tabs.activateFirst();
      return;
    }

    // Find the content that matches the hash and activate it.
    for (const content of $tabs.contents) {
      if (content.value.href === window.location.hash) {
        content.activate();
        return;
      }
    }
  });
</script>

<div class="tabs">
  <div class="tabs-container">
    {#each $tabs.contents as content}
      <a
        href={content.value.href}
        on:click={() => content.activate()}
        class="tab"
        class:active={content.isActive}
      >
        {content.value.name}
      </a>
    {/each}
  </div>

  <slot />
</div>

<style>
  .tabs {
    border-color: black;
    border-width: 1px;
    margin-bottom: 16px;
  }

  .tabs .tabs-container {
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow-x: auto;
    padding: 8px;
    margin-bottom: 16px;
    border-width: 1px;
  }

  .tabs .tab {
    min-width: 180px;
    color: black;
    padding: 1rem;
    background-color: white;
    border: 1px black solid;
  }

  .tabs .tabs-container .tab:first-child {
    margin-left: auto;
  }

  .tabs .tabs-container .tab:last-child {
    margin-right: auto;
  }

  .tabs .tab.active,
  .tabs .tab:hover {
    font-weight: bold;
  }
</style>
