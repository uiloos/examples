
<template>
  <div id="sentences-typewriter">
    {{ typewriter.text }}
    <span id="sentences-typewriter-cursor" :class="{ blinking: typewriter.cursors[0].isBlinking }"></span>
  </div>
</template>

<script lang="ts" setup>
import { useTypewriterFromSentences } from "@uiloos/vue";

const typewriter = useTypewriterFromSentences({
  sentences: [
    "Superman is the man of steel",
    "Supergirls real name is Kara Zor-El",
    "Batman is the dark knight",
    "Batmans nemesis is called the Joker",
    "The Flash can run through time",
    "Wonder woman possesses the Lasso of Truth",
  ],
  repeat: true,
  repeatDelay: 2000,
  text: "Wonder woman possesses the Lasso of Truth",
});
</script>

<style scoped>
#sentences-typewriter {
  font-family: monospace;
  font-size: 26px;
  display: inline-block;
  margin-bottom: 16px;
}

#sentences-typewriter-cursor {
  border-right-width: 4px;
  border-right-style: solid;
  border-color: green;
}

#sentences-typewriter-cursor.blinking {
  animation: example-blink 0.75s step-start infinite;
}

@keyframes example-blink {

  from,
  to {
    border-color: transparent;
  }

  50% {
    border-color: green;
  }
}
</style>