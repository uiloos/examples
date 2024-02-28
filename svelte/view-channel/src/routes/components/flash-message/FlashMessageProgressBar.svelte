<div
  bind:this={element}
  class="flash-message-progress flash-message-progress-{type}"
>
</div>

<script lang="ts">
import {onMount} from 'svelte';
import type { FlashMessageType } from "./types";
import { ViewChannelView } from "@uiloos/core";

export let type: FlashMessageType;
export let duration: number;
export let isPlaying: boolean;

let element: HTMLDivElement;
onMount(() => {
  element.style.animation = `progress ${duration}ms ease-out`;
});

$: isPlaying, onPlayingChanged();

function onPlayingChanged() {
  if (!element) {
    return;
  }

  if (isPlaying) {
    element.style.animationPlayState = "running";
  } else {
    element.style.animationPlayState = "paused";
  }
}

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

/* 
  By setting -global- before the name of the animation is 
  globally available, this way it can be triggered in the
  onMount.
*/
@keyframes -global-progress {
  from {
    background-position: right bottom;
  }
  to {
    background-position: left bottom;
  }
}
</style>