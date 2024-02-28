<script lang="ts">
  import { ActiveListContent } from '@uiloos/core';
  import type { Slide } from './types';

  export let content: ActiveListContent<Slide>;

  let buttonElement: HTMLButtonElement;

  $: onActiveChanged(
    content.isActive,
    content.activeList.autoPlay.duration,
    buttonElement
  );
  $: onPlayingChanged(content.activeList.autoPlay.isPlaying, buttonElement);

  function onActiveChanged(
    isActive: boolean,
    duration: number,
    buttonElement: HTMLButtonElement
  ) {
    if (buttonElement) {
      if (isActive) {
        buttonElement.style.animation = `progress ${duration}ms linear`;
      } else {
        buttonElement.style.animation = '';
      }
    }
  }

  function onPlayingChanged(
    isPlaying: boolean,
    buttonElement: HTMLButtonElement
  ) {
    if (buttonElement) {
      if (isPlaying) {
        buttonElement.style.animationPlayState = 'running';
      } else {
        buttonElement.style.animationPlayState = 'paused';
      }
    }
  }
</script>

<button
  bind:this={buttonElement}
  class="progress-button"
  class:active={content.isActive}
  on:click={() => content.activate()}
></button>

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
