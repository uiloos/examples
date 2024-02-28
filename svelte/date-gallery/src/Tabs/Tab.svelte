
{#if $activeHref === href}
  <div class="tab-content">
    <slot></slot>
  </div>
{/if}

<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { TABS, TABS_ACTIVE } from './Tabs.svelte';
  import type {ActiveList} from '@uiloos/core';
  import type {TabInfo} from './types';

  export let name: string;
  export let href: string;

  const tabs: ActiveList<TabInfo> = getContext(TABS);
  const activeHref: SvelteStore<string> = getContext(TABS_ACTIVE);

  onMount(() => {
    tabs.push({ name, href});
  });
</script>

<style>
.tab-content {
  padding: 16px;
}
</style>