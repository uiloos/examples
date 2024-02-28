<script lang="ts">
  import { createTypewriterStore } from '@uiloos/svelte';

  const typewriter = createTypewriterStore({
    repeat: true,
    repeatDelay: 10000,
    actions: [
      {
        type: 'keyboard',
        cursor: 0,
        text: 'This',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'summer',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'experience',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'a',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'film',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'like',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'never',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'before',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ':',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'Vampires',
        delay: 1000,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'from',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'Venus',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'VII:',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'the',
        delay: 2000,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: ' ',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: 'Quickening',
        delay: 50,
      },
      {
        type: 'keyboard',
        cursor: 0,
        text: '.',
        delay: 50,
      },
    ],
  });
</script>

<div id="movie-typewriter">{$typewriter.text}</div>

<style>
  #movie-typewriter {
    font-weight: bold;
    min-height: 100px;
    font-size: 22px;
    background: linear-gradient(#d91a1a, #333);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>
