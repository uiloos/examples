<template>
  <div class="notifications">
    <div v-if="notifications.views.length">
      <button @click="dismissAll()">Clear all</button>
    </div>
    <p v-else>No notifications yet</p>

    <div role="status" aria-live="polite">
      <Notification
        v-for="view in notifications.views"
        :key="view.data.id"
        :view="view"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Notification from "./Notification.vue";
import { useViewChannel } from "@uiloos/vue";
import { notificationChannel } from "./notification-service";

// Via useViewChannel we make sure this component re-renders
// whenever the ViewChannel changes.
const notifications = useViewChannel(notificationChannel);

function dismissAll() {
  notifications.value.dismissAll(undefined);
}
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
}
</style>
