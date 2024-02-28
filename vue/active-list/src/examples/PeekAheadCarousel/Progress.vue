<template>
  <div
    ref="progressElement"
    class="peek-ahead-carousel-progress"
    :class="{ white: hide }"
  ></div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Props {
  duration: number;
  isPlaying: boolean;
  hide: boolean;
}

const props = defineProps<Props>();

const progressElement = ref<HTMLDivElement | null>(null);

// Activate the animation
watchEffect(() => {
  if (progressElement.value) {
    progressElement.value.style.animation = `progress ${props.duration}ms linear`;
  }
});

// Trigger progress animation based on isPlaying state
watchEffect(() => {
  if (progressElement.value) {
    if (props.isPlaying) {
      progressElement.value.style.animationPlayState = "running";
    } else {
      progressElement.value.style.animationPlayState = "paused";
    }
  }
});
</script>

<style>
.peek-ahead-carousel-progress {
  margin-bottom: 4px;
  width: 512px;
  height: 8px;
  background: linear-gradient(
    to right,
    rgb(107 33 168) 50%,
    rgb(102, 102, 102) 50%
  );
  background-size: 200% 100%;
}

.peek-ahead-carousel-progress.white {
  background: white;
}

@keyframes progress {
  from {
    background-position: right bottom;
  }
  to {
    background-position: left bottom;
  }
}
</style>
