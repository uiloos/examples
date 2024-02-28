<script lang="ts">
  import { createActiveListStore } from '@uiloos/svelte';
  import Condiment from './Condiment.svelte';
  import type { Condiment as CondimentType } from './types';

  export let condiments: CondimentType[];

  const condimentsList = createActiveListStore({
    contents: condiments,
    active: [],
    // Do not allow for more than three condiments.
    maxActivationLimit: 3,

    // When the limit is reached and more condiments are activated
    // simply ignore them and keep the original three condiments.
    maxActivationLimitBehavior: 'ignore',
  });

  let cost = 0;
  $: cost = $condimentsList.activeContents.reduce((acc, content) => {
    return acc + content.value.price;
  }, 0);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
</script>

<h2>You have selected {$condimentsList.activeContents.length} condiments</h2>
<div class="condiments">
  {#each $condimentsList.activeContents as content (content.value.id)}
    <Condiment {content} />
  {/each}
</div>

<h2>Please select up to three condiments</h2>
<span class="error">
  {$condimentsList.active.length === 3
    ? 'You have selected the max number of condiments'
    : ''}
</span>
<div class="condiments">
  {#each $condimentsList.contents as content (content.value.id)}
    <Condiment {content} />
  {/each}
</div>

<h2>Cost: {currencyFormatter.format(cost)}</h2>

<style>
  .condiments {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 32px;
  }

  .error {
    color: red;
  }
</style>
