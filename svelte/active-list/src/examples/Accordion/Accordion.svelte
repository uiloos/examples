<div class="accordion-example">
    {#each $accordion.contents as content (content.value.id)}
        <details
            open={content.isActive}
            on:click={(event) => {
                // Prevent default opening of details element,
                // and let the ActiveList handle this.
                event.preventDefault();

                content.activate();
            }}
        >
            <summary>{content.value.summary}</summary>

            <p>{content.value.content}</p>
        </details>
    {/each}
</div>

<script lang="ts">
    import {createActiveListStore} from '@uiloos/svelte';
    import type { AccordionItem } from './types.ts';

    export let activeId: number;
    export let items: AccordionItem[];

    const accordion = createActiveListStore({
        contents: items,
        active: items.find((item) => item.id === activeId) ?? items[0],
    });
</script>

<style>
.accordion-example {
  margin-bottom: 16px;
  max-width: 640px;
}

.accordion-example details {
  margin: 16px 0px;
}

.accordion-example summary {
  font-weight: bold;
  cursor: pointer;
  list-style: none;
}

.accordion-example details[open] summary {
  color: #6b21a8;
}

.accordion-example details summary::before {
  margin-right: 8px;
  font-family: "Courier New", Courier, monospace;
}

.accordion-example details[open] summary::before {
  content: "-";
}

.accordion-example details summary::before {
  content: "+";
}

.accordion-example p {
  margin-left: 20px;
}
</style>