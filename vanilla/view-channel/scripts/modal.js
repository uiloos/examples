let currentModal = null;
const modalsContainerEl = document.getElementById("modals");

export const modalChannel = new window.uiloosViewChannel.ViewChannel(
  {},
  window.uiloosViewChannel.createViewChannelSubscriber({
    onPresented(event) {
      // Note: the code below would benefit from using
      // a HTML templating language such as handlebars,
      // or htm, as creating HTML using only JavaScript
      // is very tedious.

      const view = event.view;
      const modal = view.data;

      /*
        The HTML <dialog> element new and very useful but it does not 
        allow it to be awaited, using a ViewChannel we can make the 
        dialog play nice with async events. 
      */
      const modalEl = document.createElement("dialog");

      modalEl.id = `${modal.id}-modal`;
      modalEl.className = "modal";
      modalEl.ariaLabel = modal.info.title;
      modalEl.setAttribute("aria-describedby", "modal-description");

      const closeButtonEl = document.createElement("button");
      closeButtonEl.textContent = "✖";
      closeButtonEl.className = "modal-close";
      closeButtonEl.ariaLabel = "Close modal";
      closeButtonEl.onclick = () => view.dismiss(modalCancelled);

      modalEl.append(closeButtonEl);

      const h1El = document.createElement("h1");
      h1El.textContent = modal.info.title;

      modalEl.append(h1El);

      const pEl = document.createElement("p");
      pEl.id = "modal-description";
      pEl.textContent = modal.info.description;

      modalEl.append(pEl);

      const innerModalEl = document.createElement("div");

      modal.render(view, innerModalEl, modal.data);

      modalEl.append(innerModalEl);

      modalsContainerEl.append(modalEl);

      modalEl.showModal();

      // Close dialog when backdrop is clicked
      modalEl.onclick = (event) => {
        if (event.target.nodeName === "DIALOG") {
          modalEl.close();
        }
      };

      modalEl.onclose = () => {
        modalEl.remove();
      };

      currentModal = view;
    },

    onDismissed(event) {
      const view = event.view;
      const modal = view.data;

      const modalEl = document.getElementById(`${modal.id}-modal`);
      modalEl.close();

      currentModal = null;
      document.removeEventListener("keydown", closeOnEscape);
    },
  })
);

// A symbol which represents a modal's result being
// cancelled. By using a Symbol here we make sure we
// never accidentally collide with any success result
// coming from the actual modals.
export const modalCancelled = Symbol("modal cancelled");

export function showModal(render, info, data) {
  const view = modalChannel.present({
    data: {
      id: Math.random(),
      // A function which accepts a ViewChannelView,
      // a HTML div element to render the modal into
      // and the 'data' the render might need.
      render,
      data,
      info,
    },
  });

  return view.result;
}

function closeOnEscape(event) {
  if (event.key === "Escape" && currentModal) {
    currentModal.dismiss(modalCancelled);
  }
}
