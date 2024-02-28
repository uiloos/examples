<script lang="ts">
  import type { ActiveListAutoPlay } from '@uiloos/core';

  export let autoPlay: ActiveListAutoPlay;
  export let hide: boolean;
  let progressElement: HTMLDivElement;

  $: onDurationChanged(autoPlay.duration, progressElement);
  $: onPlayingChanged(autoPlay.isPlaying, progressElement);

  function onDurationChanged(
    duration: number,
    progressElement: HTMLDivElement
  ) {
    if (progressElement) {
      progressElement.style.animation = `progress ${duration}ms linear`;
    }
  }

  function onPlayingChanged(isPlaying: boolean, progressElement: HTMLDivElement) {
    if (progressElement) {
      if (isPlaying) {
        progressElement.style.animationPlayState = 'running';
      } else {
        progressElement.style.animationPlayState = 'paused';
      }
    }
  }
</script>

<div
  bind:this={progressElement}
  class="peek-ahead-carousel-progress"
  class:white={hide}
></div>

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
