const flashMessagesContainerEl = document.getElementById(
  "flash-messages-container"
);

export const flashMessageChannel = new window.uiloosViewChannel.ViewChannel(
  {},
  window.uiloosViewChannel.createViewChannelSubscriber({
    onPresented(event, viewChannel) {
      // Note: the code below would benefit from using
      // a HTML templating language such as handlebars,
      // or htm, as creating HTML using only JavaScript
      // is very tedious.

      const view = event.view;
      const flashMessage = view.data;

      const zIndex = viewChannel.views.length - view.index;

      const flashMessageEl = document.createElement("div");
      flashMessageEl.id = flashMessage.id;

      flashMessageEl.className = `flash-message flash-message-${flashMessage.type}`;
      flashMessageEl.style.zIndex = zIndex;

      flashMessageEl.onclick = () => view.dismiss();
      flashMessageEl.onmouseover = () => view.pause();
      flashMessageEl.onmouseleave = () => view.play();

      flashMessageEl.innerHTML = `
        <div class="flash-message-row">
          <div class="flash-message-content">
            <span class="flash-message-icon">
              ${typeToSymbol(flashMessage.type)}
            </span>
            <p>${flashMessage.text}</p>
          </div>
          <span class="flash-message-close">𐄂</span>
        </div>

        <div id="${
          flashMessage.id
        }-progress" class="flash-message-progress flash-message-progress-${
        flashMessage.type
      }"></div>
      `;

      // Insert before the current item holding the
      // index, if that index does not exist provide
      // `null` so it is appended to the list.
      flashMessagesContainerEl.insertBefore(
        flashMessageEl,
        flashMessagesContainerEl.children[view.index] ?? null
      );

      const progressEl = document.getElementById(`${flashMessage.id}-progress`);
      progressEl.style.animation = `progress ${view.autoDismiss.duration}ms ease-out`;
    },

    onDismissed(event) {
      const view = event.view;
      const flash = view.data;

      const flashMessageEl = document.getElementById(flash.id);

      flashMessageEl.classList.add("flash-message-exit");

      flashMessageEl.onanimationend = (event) => {
        if (event.animationName === "slide-out") {
          flashMessageEl.remove();
        }
      };
    },

    onAutoDismissPlaying(event) {
      const progressEl = document.getElementById(
        `${event.view.data.id}-progress`
      );
      progressEl.style.animationPlayState = "running";
    },

    onAutoDismissPaused(event) {
      const progressEl = document.getElementById(
        `${event.view.data.id}-progress`
      );
      progressEl.style.animationPlayState = "paused";
    }
  })
);

export function infoFlashMessage(text) {
  flashMessageChannel.present({
    data: {
      id: Math.random(),
      text,
      type: "info"
    },
    priority: 4,
    autoDismiss: {
      duration: 2000,
      result: undefined
    }
  });
}

export function warningFlashMessage(text) {
  flashMessageChannel.present({
    data: {
      id: Math.random(),
      text,
      type: "warning"
    },
    priority: 1,
    autoDismiss: {
      duration: 3000,
      result: undefined
    }
  });
}

export function errorFlashMessage(text) {
  flashMessageChannel.present({
    data: {
      id: Math.random(),
      text,
      type: "error"
    },
    priority: 0,
    autoDismiss: {
      duration: 5000,
      result: undefined
    }
  });
}

export function successFlashMessage(text) {
  flashMessageChannel.present({
    data: {
      id: Math.random(),
      text,
      type: "success"
    },
    priority: 2,
    autoDismiss: {
      duration: 2000,
      result: undefined
    }
  });
}

// UTILS

function typeToSymbol(type) {
  switch (type) {
    case "info":
      return "ⓘ";

    case "warning":
      return "⚠";

    case "error":
      return "☠";

    case "success":
      return "✓";

    default:
      return "unknown";
  }
}
