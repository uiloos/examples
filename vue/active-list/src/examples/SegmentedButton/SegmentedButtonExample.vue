<template>
  <div class="segment-example">
    <SegmentedButton
      :buttons="[
        {
          label: 'Left',
          onClick() {
            setTextAlign('left');
          },
        },
        {
          label: 'Center',
          onClick() {
            setTextAlign('center');
          },
          active: true,
        },
        {
          label: 'Right',
          onClick() {
            setTextAlign('right');
          },
        },
      ]"
    />

    <p :style="{ textAlign }">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi
      tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem
      nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae
      neque!
    </p>
  </div>
  <div class="description">
    <p>
      A segmented button only allows one item to be active at the same time,
      which is a perfect usecase for the ActiveList.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import SegmentedButton from "./SegmentedButton.vue";

// State for the SegmentedButton example
type TextAlign = "left" | "center" | "right";

let textAlign = ref<TextAlign>("center");

function setTextAlign(alignment: "left" | "center" | "right") {
  textAlign.value = alignment;
}
</script>

<style>
.segment-example {
  margin-bottom: 16px;
}

.segment-example .tab-content {
  padding: 1rem;
}

.segment-example p {
  padding: 0 64px;
  margin: 16px 0;
  max-width: 512px;
}
</style>
