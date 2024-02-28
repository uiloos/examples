document.addEventListener("alpine:init", () => {
  const notificationChannel = new window.uiloosViewChannel.ViewChannel({});

  const actions = {
    add({ priority = 0, text, buttons = [] }) {
      notificationChannel.present({
        priority,
        data: {
          id: Math.random(),
          text,
          buttons
        }
      });
    }
  };

  Alpine.store(
    "notifications",
    window.uiloosAlpineViewChannel.createViewChannelStore({
      viewChannel: notificationChannel,
      actions
    })
  );
});
