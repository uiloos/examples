
<template>
  <div role="status" aria-live="polite">
    <TransitionGroup name="flash-message">
      <FlashMessage
        v-for="view in flashMessages.views"
        :key="view.data.id"
        :view="view"
      />
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import FlashMessage from "./FlashMessage.vue";
import { useViewChannel } from "@uiloos/vue";
import { flashMessageChannel } from "./flash-message-service";

const flashMessages = useViewChannel(flashMessageChannel);
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slide-out {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    visibility: visible;
  }

  to {
    transform: translate3d(0, -100%, 0);
    opacity: 0;
  }
}

.flash-message-enter-active {
  animation: slide-out 200ms ease-out;
}

.flash-message-enter-active,
.flash-message-leaves-active {
  animation: slide-in 200ms ease-out;
}
.flash-message-enter-from,
.flash-message-leave-to {
  animation: slide-out 200ms ease-out;
}
</style>
