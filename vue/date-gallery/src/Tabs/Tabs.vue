<template>
  <div class="tabs">
    <div class="tabs-container">
      <a
        v-for="content in tabs.contents"
        :key="content.value.href"
        :href="content.value.href"
        @click="content.activate()"
        class="tab"
        :class="{ active: content.isActive }"
      >
        {{ content.value.name }}
      </a>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted, watchEffect } from "vue";
import { useActiveList } from "@uiloos/vue";
import { tabInjectionKey, activeInjectionKey } from "./util";
import type { TabInfo } from "./types";

const tabs = useActiveList<TabInfo>({ contents: [] });

provide(tabInjectionKey, tabs.value);

let activeHref = ref(window.location.hash ?? "");
provide(activeInjectionKey, activeHref);

onMounted(() => {
  // Activate the first tab if no hash is available.
  if (!window.location.hash) {
    tabs.value.activateFirst();
    return;
  }

  // Find the content that matches the hash and activate it.
  for (const content of tabs.value.contents) {
    if (content.value.href === window.location.hash) {
      content.activate();
      return;
    }
  }
});

watchEffect(() => {
  activeHref.value = tabs.value.lastActivated?.href ?? "";
});
</script>

<style scoped>
.tabs {
  border-color: black;
  border-width: 1px;
  margin-bottom: 16px;
}

.tabs .tabs-container {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  padding: 8px;
  margin-bottom: 16px;
  border-width: 1px;
}

.tabs .tab {
  min-width: 180px;
  color: black;
  padding: 1rem;
  background-color: white;
  border: 1px black solid;
}

.tabs .tabs-container .tab:first-child {
  margin-left: auto;
}

.tabs .tabs-container .tab:last-child {
  margin-right: auto;
}

.tabs .tab.active,
.tabs .tab:hover {
  font-weight: bold;
}
</style>
