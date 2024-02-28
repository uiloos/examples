<template>
  <div v-if="activeHref === props.href" class="tab-content">
    <slot></slot>
  </div>

  
</template>

<script setup lang="ts">
import { ActiveList } from "@uiloos/core";
import { Ref, inject, ref, unref } from "vue";
import { activeInjectionKey, tabInjectionKey } from "./util";
import type { TabInfo } from "./types";

interface Props {
  name: string;
  href: string;
}

const props = defineProps<Props>();

const tabs = unref(inject(tabInjectionKey) as ActiveList<TabInfo>);
const activeHref = inject(activeInjectionKey) as Ref<string>;

ref(tabs.push({ ...props }));
</script>

<style scoped>
.tab-content {
  display: grid;
  justify-content: center;
  padding: 16px;
}
</style>
