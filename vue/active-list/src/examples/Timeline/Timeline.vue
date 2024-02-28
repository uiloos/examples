<template>
  <div class="timeline">
    <ol class="timeline-list">
      <li
        v-for="content in timeline.contents"
        :key="content.value.id"
        class="timeline-item"
        :class="{
          current: content.isActive,
          seen: content.hasBeenActiveBefore,
          next: content.isNext,
        }"
      >
        <button @click="content.activate()">
          <span class="timeline-item-label">{{ content.value.name }}</span>
          <span class="timeline-item-time">{{ content.value.released }}</span>
        </button>
      </li>
    </ol>

    <div id="timeline-content-0" class="timeline-content">
      <div class="timeline-content-controls">
        <button
          class="timeline-previous"
          type="button"
          @click="timeline.activatePrevious()"
        >
          ‹
        </button>

        <h1>{{ timeline.lastActivated?.name }}</h1>

        <button
          class="timeline-next"
          type="button"
          @click="timeline.activateNext()"
        >
          ›
        </button>
      </div>

      <p>{{ timeline.lastActivated?.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActiveList } from "@uiloos/vue";
import type { TimelineItem } from "./types";

interface Props {
  items: TimelineItem[];
}

const props = defineProps<Props>();

const timeline = useActiveList({
  contents: props.items,
  active: props.items[0],
});
</script>

<style>
.timeline {
  display: flex;
  width: 512px;
}

.timeline h1 {
  margin: 0;
}

.timeline-list {
  list-style: none;
}

.timeline-content {
  flex-grow: 1;
}

.timeline-item {
  width: 200px;
  height: 80px;
  border-left: 4px grey solid;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.timeline-item button {
  display: grid;
  background-color: white;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
}

.timeline-item:before {
  content: "";
  border-radius: 50%;
  background-color: gray;
  width: 32px;
  height: 32px;
  position: relative;
  left: -18px;
  top: 24px;
  display: block;
}

.timeline-item.seen:before {
  background-color: lightgrey;
}

.timeline-item.current:before {
  background-color: royalblue;
}

.timeline-item.next:before {
  background-color: skyblue;
}

.timeline-item-label {
  font-weight: bold;
  margin-left: 24px;
  margin-top: -10px;
}

.timeline-item-time {
  margin-left: 24px;
  font-weight: lighter;
}

.timeline-content {
  margin-top: 42px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px;
}

.timeline-content-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-content-controls button {
  font-size: 64px;
  cursor: pointer;
  background-color: white;
}

.timeline-content-controls button:hover {
  color: rgb(107 33 168);
}
</style>
