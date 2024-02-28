const notificationContainerEl = document.getElementById(
  "notifications-container"
);
const clearAllButtonEl = document.getElementById("clear-notification");
const emptyMessageEl = document.getElementById("notification-empty");

export const notificationChannel = new window.uiloosViewChannel.ViewChannel(
  {},
  window.uiloosViewChannel.createViewChannelSubscriber({
    debug: true,
    onInitialized(event, viewChannel) {
      syncEmptyState(viewChannel);
    },

    onPresented(event, viewChannel) {
      // Note: the code below would benefit from using
      // a HTML templating language such as handlebars,
      // or htm, as creating HTML using only JavaScript
      // is very tedious.

      const view = event.view;
      const notification = view.data;

      const notificationEl = document.createElement("div");
      notificationEl.id = notification.id;
      notificationEl.className = "notification";
      notificationEl.textContent = notification.text;

      const buttonsEl = document.createElement("div");
      buttonsEl.className = "notification-buttons";

      const clearButtonEl = document.createElement("button");
      clearButtonEl.textContent = "Clear";
      clearButtonEl.onclick = () => view.dismiss(undefined);
      clearButtonEl.className = "notification-button";

      buttonsEl.append(clearButtonEl);

      notification.buttons.forEach((button) => {
        const btnEl = document.createElement("button");
        btnEl.onclick = (event) => button.onClick(event, view);
        btnEl.className = "notification-button";
        btnEl.textContent = button.label;

        buttonsEl.append(btnEl);
      });

      notificationEl.append(buttonsEl);

      // Insert before the current item holding the
      // index, if that index does not exist provide
      // `null` so it is appended to the list.
      notificationContainerEl.insertBefore(
        notificationEl,
        notificationContainerEl.children[view.index] ?? null
      );

      syncEmptyState(viewChannel);
    },

    onDismissed(event, viewChannel) {
      const view = event.view;
      const notification = view.data;

      const notificationEl = document.getElementById(notification.id);

      notificationEl.remove();

      syncEmptyState(viewChannel);
    },

    onDismissedAll(event, viewChannel) {
      notificationContainerEl.innerHTML = "";

      syncEmptyState(viewChannel);
    }
  })
);

function syncEmptyState(viewChannel) {
  const isEmpty = viewChannel.views.length === 0;

  clearAllButtonEl.style.display = !isEmpty ? "block" : "none";

  emptyMessageEl.style.display = isEmpty ? "block" : "none";
}

export function addNotification({ priority = 0, text, buttons = [] }) {
  notificationChannel.present({
    priority,
    data: {
      id: Math.random(),
      text,
      buttons
    }
  });
}

clearAllButtonEl.onclick = () => {
  notificationChannel.dismissAll(undefined);
};
