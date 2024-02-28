<template>
  <div class="classic-carousel" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <ul>
      <li v-for="content in carousel.contents" :key="content.value.id" :aria-hidden="!content.isActive" :class="content.isActive
          ? activeCss
          : carousel.lastDeactivatedIndex === content.index
            ? previousCss
            : 'slide'
        ">
        <img width="1920" height="1280" :src="content.value.img.src" :alt="`a ${content.value.name}`" />

        <article>
          <h4>{{ content.value.name }}</h4>
          <p>{{ content.value.description }}</p>

          <p>
            Photo by
            <a :href="content.value.img.attribution" target="_blank" rel="noopener noreferrer">
              {{ content.value.img.author }}
            </a>
          </p>
        </article>
      </li>
    </ul>

    <ul class="progress">
      <li v-for="content in carousel.contents" :key="content.value.id">
        <ProgressButton :isActive="content.isActive" :isPlaying="carousel.autoPlay.isPlaying"
          :duration="carousel.autoPlay.duration" @click="content.activate()" />
      </li>
    </ul>

    <div class="controls">
      <div class="controls-container">
        <button @click="carousel.activatePrevious()" type="button">‹</button>

        <button @click="carousel.activateNext()" type="button">›</button>
      </div>
    </div>

    <div aria-live="polite" aria-atomic="true" class="visually-hidden">
      Owl {$carousel.lastActivatedIndex + 1} of 5
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useActiveList } from "@uiloos/vue";
import type { Slide } from "./types";
import ProgressButton from "./ProgressButton.vue";

const ANIMATION_DURATION = 500;

interface Props {
  slides: Slide[];
}

const props = defineProps<Props>();

const carousel = useActiveList({
  contents: props.slides,
  active: props.slides[0],
  autoPlay: {
    // Each slide should take 5000 milliseconds, note
    // that you can also provide a function so each
    // slide has a unique duration.
    duration: 5000,

    // Stop the autoplay whenever an action occurs
    // by a human.
    stopsOnUserInteraction: true,
  },
  // Prevent user interaction until the animation
  // is complete
  cooldown: ANIMATION_DURATION,
  // Make the last slide go to the first slice and vice versa
  isCircular: true,
});

// These will contain the CSS classes for the active slide,
// and the previous slide. I'm using a simple useState for
// the animations but you can use any React based animation
// library.
const activeCss = ref("slide active");
const previousCss = ref("slide");

// The slide animation is triggerd within this watch.
watch(
  () => {
    return carousel.value.lastDeactivated;
  },
  () => {
    // When the carousel is first rendered there is no previous
    // slide, in that case do nothing.
    if (!carousel.value.lastDeactivated) {
      return;
    }

    // First put the newly active slide off-screen so we
    // can animate it in.
    activeCss.value = `slide ${carousel.value.direction}`;

    // Next position the previous slide to be front and center.
    previousCss.value = `slide active`;

    // Now that the slides are in place trigger the animation
    // but do it after a timeout so the animation is not janky.
    setTimeout(() => {
      // Now slide the active slide in.
      activeCss.value = `slide active animate`;

      // And at the same time slide out the previously active slide
      // to the opposite direction.
      previousCss.value = `slide animate ${carousel.value.oppositeDirection}`;
    }, 100);
  },
);

function onMouseEnter() {
  carousel.value.pause();
}

function onMouseLeave() {
  // Only when the user has not assumed control do
  // we start playing again.
  if (!carousel.value.autoPlay.hasBeenStoppedBefore) {
    carousel.value.play();
  }
}
</script>

<style>
.classic-carousel {
  height: 480px;
  width: 512px;
  overflow-x: hidden;
}

.classic-carousel ul {
  position: relative;
}

.classic-carousel .slide.right {
  position: absolute;
  top: 0;
  display: block;
  transform: translateX(100%);
}

.classic-carousel .slide.left {
  position: absolute;
  top: 0;
  display: block;
  transform: translateX(-100%);
}

.classic-carousel .slide.active {
  position: absolute;
  display: block;
  transform: translateX(0);
}

.classic-carousel .slide.animate {
  transition: transform 0.5s;
}

.classic-carousel .slide img {
  max-width: 100%;
  height: auto;
}

.classic-carousel .slide {
  display: none;
}

.classic-carousel article {
  padding: 12px;
}

.classic-carousel article h4 {
  margin-bottom: 8px;
}

.classic-carousel .progress {
  display: flex;
  justify-content: center;
  gap: 10px;
  list-style-type: none;
}

.classic-carousel .controls {
  width: 100%;
  max-width: 512px;
  position: absolute;
  top: 200px;
  padding: 0 12px;
}

.classic-carousel .controls-container {
  display: flex;
  justify-content: space-between;
}

.classic-carousel .controls-container>button {
  border: none;
  background: none;
  font-size: 82px;
  color: purple;
  cursor: pointer;
}
</style>
