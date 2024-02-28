document.addEventListener("alpine:init", () => {
  const flashMessageChannel = new window.uiloosViewChannel.ViewChannel({});

  const actions = {
    infoFlashMessage(text) {
      flashMessageChannel.present({
        data: {
          id: Math.random(),
          text,
          type: "info",
          symbol: "ⓘ"
        },
        priority: 4,
        autoDismiss: {
          duration: 2000,
          result: undefined
        }
      });
    },

    warningFlashMessage(text) {
      flashMessageChannel.present({
        data: {
          id: Math.random(),
          text,
          type: "warning",
          symbol: "⚠"
        },
        priority: 1,
        autoDismiss: {
          duration: 3000,
          result: undefined
        }
      });
    },

    errorFlashMessage(text) {
      flashMessageChannel.present({
        data: {
          id: Math.random(),
          text,
          type: "error",
          symbol: "☠"
        },
        priority: 0,
        autoDismiss: {
          duration: 5000,
          result: undefined
        }
      });
    },

    successFlashMessage(text) {
      flashMessageChannel.present({
        data: {
          id: Math.random(),
          text,
          type: "success",
          symbol: "✓"
        },
        priority: 2,
        autoDismiss: {
          duration: 2000,
          result: undefined
        }
      });
    }
  };

  Alpine.store(
    "flashMessages",
    window.uiloosAlpineViewChannel.createViewChannelStore({
      viewChannel: flashMessageChannel,
      actions
    })
  );
});
