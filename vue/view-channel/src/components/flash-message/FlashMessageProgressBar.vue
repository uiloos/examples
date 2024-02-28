
<template>
  <div ref="element" :class="['flash-message-progress', 'flash-message-progress-' + type]"></div>
</template>

<script lang="ts" setup>
import { FlashMessageType } from "./types";
import { ref, onMounted, watch } from "vue";

interface Props {
  type: FlashMessageType;
  duration: number;
  isPlaying: boolean;
}

const props = defineProps<Props>();
const { type, duration } = props;

const element = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (element.value) {
    element.value.style.animation = `progress ${duration}ms ease-out`;
  }
});

watch(
  () => props.isPlaying,
  () => {
    if (element.value) {
      if (props.isPlaying) {
        element.value.style.animationPlayState = "running";
      } else {
        element.value.style.animationPlayState = "paused";
      }
    }
  }
);
</script>

<style>
.flash-message-progress {
  will-change: animation, background-position;
  position: relative;
  top: 8px;
  left: -8px;
  height: 4px;
  width: calc(100% + 16px);

  background-position: right bottom;
}

.flash-message-progress-info {
  background: linear-gradient(to right, #3b82f6 50%, #063b91 50%);
  background-size: 200% 100%;
}

.flash-message-progress-warning {
  background: linear-gradient(to right, #eab308 50%, #755904 50%);
  background-size: 200% 100%;
}

.flash-message-progress-error {
  background: linear-gradient(to right, #ef4444 50%, #8d0c0c 50%);
  background-size: 200% 100%;
}

.flash-message-progress-success {
  background: linear-gradient(to right, #22c55e 50%, #10622f 50%);
  background-size: 200% 100%;
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