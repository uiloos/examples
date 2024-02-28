const dialogsContainerEl = document.getElementById("confirmation-dialogs");

export const confirmationDialogChannel =
  new window.uiloosViewChannel.ViewChannel(
    {},
    window.uiloosViewChannel.createViewChannelSubscriber({
      onPresented(event) {
        // Note: the code below would benefit from using
        // a HTML templating language such as handlebars,
        // or htm, as creating HTML using only JavaScript
        // is very tedious.

        const view = event.view;
        const dialog = view.data;

        /*
          The HTML <dialog> element new and very useful but it does not 
          allow it to be awaited, using a ViewChannel we can make the 
          dialog play nice with async events. 
        */
        const dialogEl = document.createElement("dialog");
        dialogEl.id = `${dialog.id}-dialog`;
        dialogEl.className = "confirmation-dialog";
        dialogEl.innerHTML = `
          <strong>Please confirm</strong>
          <p id="confirm-text">${dialog.text}</p>
        `;
        dialogEl.ariaLabel = "Please confirm";
        dialogEl.setAttribute("aria-describedby", "confirm-text");

        const dialogButtonBar = document.createElement("div");
        dialogButtonBar.className = "confirmation-dialog-button-bar";

        const okButtonEl = document.createElement("button");
        okButtonEl.textContent = "Ok";
        okButtonEl.onclick = () => view.dismiss(true);

        const cancelButtonEl = document.createElement("button");
        cancelButtonEl.textContent = "Cancel";
        cancelButtonEl.onclick = () => view.dismiss(false);

        dialogButtonBar.append(okButtonEl, cancelButtonEl);

        dialogEl.append(dialogButtonBar);

        dialogsContainerEl.append(dialogEl);

        dialogEl.showModal();

        // Close dialog when backdrop is clicked
        dialogEl.onclick = (event) => {
          if (event.target.nodeName === "DIALOG") {
            dialogEl.close();
          }
        };

        dialogEl.onclose = () => {
          dialogEl.remove();
        };
      },

      onDismissed(event) {
        const view = event.view;
        const dialog = view.data;

        const dialogEl = document.getElementById(`${dialog.id}-dialog`);
        dialogEl.close();
      },
    })
  );

export function confirmDialog(text) {
  return confirmationDialogChannel.present({
    data: {
      id: Math.random(),
      text,
    },
  }).result;
}
