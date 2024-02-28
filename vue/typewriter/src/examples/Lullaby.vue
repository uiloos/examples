
<template>
  <div id="lullaby-typewriter">{{ text }}</div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useTypewriter } from "@uiloos/vue";

const text = ref("");

const typewriter = useTypewriter({
  repeat: true,
  repeatDelay: 10000,
  actions: [
    { type: "keyboard", cursor: 0, text: "Twinkle", delay: 500 },
    { type: "keyboard", cursor: 0, text: "twinkle", delay: 500 },
    { type: "keyboard", cursor: 0, text: "little", delay: 500 },
    { type: "keyboard", cursor: 0, text: "star", delay: 500 },
    { type: "keyboard", cursor: 0, text: "How", delay: 500 },
    { type: "keyboard", cursor: 0, text: "I", delay: 500 },
    { type: "keyboard", cursor: 0, text: "wonder", delay: 500 },
    { type: "keyboard", cursor: 0, text: "what", delay: 500 },
    { type: "keyboard", cursor: 0, text: "you", delay: 500 },
    { type: "keyboard", cursor: 0, text: "are!", delay: 500 },
    { type: "keyboard", cursor: 0, text: "Up", delay: 500 },
    { type: "keyboard", cursor: 0, text: "above", delay: 500 },
    { type: "keyboard", cursor: 0, text: "the", delay: 500 },
    { type: "keyboard", cursor: 0, text: "world", delay: 500 },
    { type: "keyboard", cursor: 0, text: "so", delay: 500 },
    { type: "keyboard", cursor: 0, text: "high.", delay: 500 },
    { type: "keyboard", cursor: 0, text: "Like", delay: 500 },
    { type: "keyboard", cursor: 0, text: "a", delay: 500 },
    { type: "keyboard", cursor: 0, text: "diamond", delay: 500 },
    { type: "keyboard", cursor: 0, text: "in", delay: 500 },
    { type: "keyboard", cursor: 0, text: "the", delay: 500 },
    { type: "keyboard", cursor: 0, text: "sky", delay: 500 },
    { type: "keyboard", cursor: 0, text: "Twinkle,", delay: 500 },
    { type: "keyboard", cursor: 0, text: "twinkle", delay: 500 },
    { type: "keyboard", cursor: 0, text: "little", delay: 500 },
    { type: "keyboard", cursor: 0, text: "star", delay: 500 },
    { type: "keyboard", cursor: 0, text: "How", delay: 500 },
    { type: "keyboard", cursor: 0, text: "I", delay: 500 },
    { type: "keyboard", cursor: 0, text: "wonder", delay: 500 },
    { type: "keyboard", cursor: 0, text: "what", delay: 500 },
    { type: "keyboard", cursor: 0, text: "you", delay: 500 },
    { type: "keyboard", cursor: 0, text: "are!", delay: 500 },
  ],
});

watchEffect(() => {
  if (
    typewriter.value.lastPerformedAction &&
    "text" in typewriter.value.lastPerformedAction
  ) {
    text.value = `🎵 ${typewriter.value.lastPerformedAction.text} 🎵`;
  }
});
</script>

<style scoped>
#lullaby-typewriter {
  font-weight: bold;
  font-size: 32px;
}
</style>