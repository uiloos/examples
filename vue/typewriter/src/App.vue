<template>
  <div class="examples">
    <Sentences />
    <Multicursor />
    <Movie />
    <Lullaby />
    <Karaoke />
    <Interactive />
  </div>
</template>

<script setup lang="ts">
import Sentences from "./examples/Sentences.vue";
import Multicursor from "./examples/Multicursor.vue";
import Movie from "./examples/Movie.vue";
import Lullaby from "./examples/Lullaby.vue";
import Karaoke from "./examples/Karaoke.vue";
import Interactive from "./examples/Interactive.vue";
</script>

<style scoped>
.examples {
  display: grid;
  grid-gap: 42px;
}
</style>