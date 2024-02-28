<div class="gallery-example">
    <div class="gallery-selected">
    <img
        width="1920"
        height="1280"
        src={$gallery.lastActivated?.src}
        alt={$gallery.lastActivated?.alt}
    />
    </div>

    <ul class="gallery-items">
        {#each $gallery.contents as content (content.value.src)}
            <li>
                <button on:click={() => content.activate()}>
                    <img
                        width="1920"
                        height="1280"
                        src={content.value.src}
                        alt={content.value.alt}
                    />
                </button>
            </li>
        {/each}
    </ul>
</div>

<script lang="ts">
import { createActiveListStore } from "@uiloos/svelte";
import type { GalleryImage } from "./types";

export let images: GalleryImage[];

const gallery = createActiveListStore({
    contents: images,
    active: images[0],
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