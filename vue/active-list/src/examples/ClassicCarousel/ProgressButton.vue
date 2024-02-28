<template>
  <button
    ref="buttonElement"
    class="progress-button"
    :class="{ active: isActive }"
    @click="$emit('click')"
  ></button>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

interface Props {
  duration: number;
  isActive: boolean;
  isPlaying: boolean;
}

const props = defineProps<Props>();

let buttonElement = ref<HTMLButtonElement | null>(null);

watchEffect(() => {
  if (buttonElement.value) {
    if (props.isActive) {
      buttonElement.value.style.animation = `progress ${props.duration}ms linear`;
    } else {
      buttonElement.value.style.animation = "";
    }
  }
});

watchEffect(() => {
  if (buttonElement.value) {
    if (props.isPlaying) {
      buttonElement.value.style.animationPlayState = "running";
    } else {
      buttonElement.value.style.animationPlayState = "paused";
    }
  }
});
</script>

<style>
.progress-button {
  width: 30px;
  background-color: gray;
  height: 4px;
  border: none;
  cursor: pointer;
}

.progress-button.active {
  background: linear-gradient(
    to right,
    rgb(107 33 168) 50%,
    rgb(102, 102, 102) 50%
  );
  background-size: 200% 100%;
}

@keyframes -global-progress {
  from {
    background-position: right bottom;
  }
  to {
    background-position: left bottom;
  }
}
</style>
