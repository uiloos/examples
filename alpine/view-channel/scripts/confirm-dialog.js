document.addEventListener("alpine:init", () => {
  const confirmationDialogChannel = new window.uiloosViewChannel.ViewChannel(
    {}
  );

  const actions = {
    confirmDialog(text) {
      return confirmationDialogChannel.present({
        data: {
          id: Math.random(),
          text
        }
      }).result;
    }
  };

  Alpine.store(
    "confirmationDialogs",
    window.uiloosAlpineViewChannel.createViewChannelStore({
      viewChannel: confirmationDialogChannel,
      actions
    })
  );
});
