<template>
  <div class="accordion-example">
    <details
      v-for="content in accordion.contents"
      :key="content.value.id"
      :open="content.isActive"
      @click="open($event, content)"
    >
      <summary>{{ content.value.summary }}</summary>

      <p>{{ content.value.content }}</p>
    </details>
  </div>
</template>

<script setup lang="ts">
import { useActiveList } from "@uiloos/vue";
import type { ActiveListContent } from "@uiloos/core";
import type { AccordionItem } from "./types";

interface Props {
  activeId: number;
  items: AccordionItem[];
}

const props = defineProps<Props>();

const accordion = useActiveList({
  contents: props.items,
  active:
    props.items.find((item) => item.id === props.activeId) ?? props.items[0],
});

// Prevent default opening of details element, // and let the ActiveList
function open(event: MouseEvent, content: ActiveListContent<AccordionItem>) {
  event.preventDefault();
  content.activate();
}
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
