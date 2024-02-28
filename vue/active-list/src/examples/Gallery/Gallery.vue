<template>
  <div class="gallery-example">
    <div class="gallery-selected">
      <img
        width="1920"
        height="1280"
        :src="gallery.lastActivated?.src"
        :alt="gallery.lastActivated?.alt"
      />
    </div>

    <ul class="gallery-items">
      <li v-for="content in gallery.contents" :key="content.value.src">
        <button @click="content.activate()">
          <img
            width="1920"
            height="1280"
            :src="content.value.src"
            :alt="content.value.alt"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useActiveList } from "@uiloos/vue";
import type { GalleryImage } from "./types";

interface Props {
  images: GalleryImage[];
}

const props = defineProps<Props>();

const gallery = useActiveList({
  contents: props.images,
  active: props.images[0],
});
</script>

<style>
.gallery-example {
  width: 512px;
  overflow-x: hidden;
}

.gallery-example,
.gallery-selected {
  margin-bottom: 16px;
  width: 512px;
}

.gallery-example ul {
  list-style-type: none;
  display: flex;
}

.gallery-example .gallery-items button {
  cursor: pointer;
}

.gallery-example img {
  max-width: 100%;
  height: auto;
}
</style>
