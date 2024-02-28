
{#if $activeHref === href}
  <div class="tab-content">
    <slot></slot>
  </div>
{/if}

<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { TABS, TABS_ACTIVE } from './Tabs.svelte';
  import type { ActiveList } from '@uiloos/core';
  import type { TabInfo } from './types';
  import type { Writable } from 'svelte/store';

  export let name: string;
  export let href: string;

  const tabs = getContext(TABS) as ActiveList<TabInfo>;
  const activeHref = getContext(TABS_ACTIVE) as Writable<string>;

  onMount(() => {
    tabs.push({ name, href});
  });
</script>

<style>
.tab-content {
  display: grid;
  justify-content: center;
  padding: 16px;
}
</style>