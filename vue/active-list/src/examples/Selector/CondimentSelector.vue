<template>
  <h2>
    You have selected {{ condimentsList.activeContents.length }} condiments
  </h2>
  <div class="condiments">
    <Condiment
      v-for="content in condimentsList.activeContents"
      :key="content.value.id"
      :content="content"
      :isActive="true"
    />
  </div>

  <h2>Please select up to three condiments</h2>
  <span class="error">
    {{
      condimentsList.active.length === 3
        ? "You have selected the max number of condiments"
        : ""
    }}
  </span>
  <div class="condiments">
    <Condiment
      v-for="content in condimentsList.contents"
      :key="content.value.id"
      :content="content"
      :isActive="content.isActive"
    />
  </div>

  <h2>Cost: {{ currencyFormatter.format(cost) }}</h2>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useActiveList } from "@uiloos/vue";
import Condiment from "./Condiment.vue";
import type { Condiment as CondimentType } from "./types";

interface Props {
  condiments: CondimentType[];
}

const props = defineProps<Props>();

const condimentsList = useActiveList({
  contents: props.condiments,
  active: [],
  // Do not allow for more than three condiments.
  maxActivationLimit: 3,

  // When the limit is reached and more condiments are activated
  // simply ignore them and keep the original three condiments.
  maxActivationLimitBehavior: "ignore",
});

let cost = ref(0);

watchEffect(() => {
  cost.value = condimentsList.value.activeContents.reduce((acc, content) => {
    return acc + content.value.price;
  }, 0);
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
</script>

<style>
.condiments {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 32px;
}

.error {
  color: red;
}
</style>
