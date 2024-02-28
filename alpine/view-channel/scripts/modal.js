document.addEventListener("alpine:init", () => {
  const modalChannel = new window.uiloosViewChannel.ViewChannel({});

  const actions = {
    showModal(render, info, data) {
      const view = modalChannel.present({
        data: {
          id: Math.random(),
          // A function which accepts a ViewChannelView,
          // a HTML div element to render the modal into
          // and the 'data' the render might need.
          render,
          data,
          info
        }
      });

      return view.result;
    }
  };

  Alpine.store(
    "modals",
    window.uiloosAlpineViewChannel.createViewChannelStore({
      viewChannel: modalChannel,
      actions
    })
  );
});
