
<template>
  <div>
    <div id="interactive-typewriter-text" @mouseenter="onMouseEnter()" @mouseout="onMouseOut()">
      {{ typewriter.text }}
    </div>
    <button @click="play()">Play</button>
    <button @click="pause()">Pause</button>
    <button @click="stop()">Stop</button>
  </div>
</template>

<script lang="ts" setup>
import { useTypewriter } from "@uiloos/vue";

const typewriter = useTypewriter({
  repeat: true,
  repeatDelay: 1000,
  autoPlay: false,
  text:
    'This animations autoPlay is disabled, press "play" to start, or hover over this text.',
  actions: [
    {
      type: "keyboard",
      cursor: 0,
      text: "⎚",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "C",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 132,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 84,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "c",
      delay: 114,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "k",
      delay: 91,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 110,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "u",
      delay: 95,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 85,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 108,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 114,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 144,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 55,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 65,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 99,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "u",
      delay: 117,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 47,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 102,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 55,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 93,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "h",
      delay: 51,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 100,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 130,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 138,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "m",
      delay: 68,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 67,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 111,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 26,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 34,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 55,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 30,
      delay: 150,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 30,
      delay: 150,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 0,
      delay: 150,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 36,
      selection: {
        start: 0,
        end: 36,
      },
      delay: 30,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "⌫",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "C",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 112,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 85,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "c",
      delay: 100,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "k",
      delay: 112,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 100,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 103,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 37,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 96,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 91,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 72,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 55,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 143,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 89,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 130,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 81,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 72,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "h",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 66,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 123,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 99,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 113,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 135,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "m",
      delay: 85,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 51,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 82,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 45,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 60,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 50,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: ",",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 76,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "c",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 74,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 68,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "c",
      delay: 84,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "k",
      delay: 97,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 52,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "g",
      delay: 58,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 90,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 104,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "y",
      delay: 82,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 85,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "w",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 90,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 78,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "h",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 109,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 108,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 69,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "r",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 80,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 119,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 92,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "r",
      delay: 113,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 97,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 136,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 143,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 93,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 65,
      delay: 150,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 62,
      delay: 132,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 69,
      selection: {
        start: 62,
        end: 69,
      },
      delay: 93,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 0,
      delay: 89,
    },
    {
      type: "mouse",
      cursor: 0,
      position: 72,
      selection: {
        start: 0,
        end: 72,
      },
      delay: 100,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "Y",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "u",
      delay: 87,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 94,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "c",
      delay: 84,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 92,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 91,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 95,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 90,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "l",
      delay: 128,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 74,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 91,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "h",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "v",
      delay: 105,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "r",
      delay: 92,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: '"',
      delay: 138,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 126,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "v",
      delay: 101,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 133,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "r",
      delay: 92,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 100,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 105,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "h",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 139,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 94,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "m",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 125,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 109,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 113,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 110,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "n",
      delay: 110,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 124,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 142,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "o",
      delay: 111,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 119,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "p",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "a",
      delay: 130,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "u",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "s",
      delay: 136,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "e",
      delay: 114,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: " ",
      delay: 132,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "i",
      delay: 150,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: "t",
      delay: 117,
    },
    {
      type: "keyboard",
      cursor: 0,
      text: ".",
      delay: 119,
    },
  ],
});

function pause() {
  typewriter.value.pause();
}

function play() {
  typewriter.value.play();
}

function stop() {
  typewriter.value.stop();
}

function onMouseEnter() {
  typewriter.value.pause();
}

function onMouseOut() {
  if (!typewriter.value.hasBeenStoppedBefore) {
    typewriter.value.play();
  }
}
</script>

<style scoped>
#interactive-typewriter-text {
  height: 32px;
}
</style>