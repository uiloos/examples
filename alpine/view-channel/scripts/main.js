import "./confirm-dialog.js";
import "./modal.js";

import "./flash-message.js";
import "./notification.js";

import { pokemonModal } from "/scripts/example-modals/pokemon-modal.js";
import { planetModal } from "/scripts/example-modals/planet-modal.js";
import { carModal } from "/scripts/example-modals/car-modal.js";

document.addEventListener("alpine:init", () => {
  const flashMessages = Alpine.store("flashMessages");
  const notifications = Alpine.store("notifications");
  const confirmationDialog = Alpine.store("confirmationDialogs");
  const modals = Alpine.store("modals");

  Alpine.data("main", () => ({
    async pickPokemon() {
      const result = await modals.showModal(
        pokemonModal,
        {
          title: "Pick pokemon",
          description: "Please select your starter pokemon"
        },
        {
          text: "Choose wisely!"
        }
      );

      if (result !== "CANCELLED") {
        flashMessages.infoFlashMessage(
          `You start you adventure with ${result}`
        );

        notifications.add({
          text: `Pokemon adventure started with ${result}`,
          priority: 2
        });
      } else {
        flashMessages.warningFlashMessage(
          "You declined to go on an adventure."
        );
      }
    },

    async pickCar() {
      const result = await modals.showModal(
        carModal,
        {
          title: "Pick car",
          description: "Please select your prize"
        },
        {}
      );

      if (result !== "CANCELLED") {
        flashMessages.successFlashMessage(`You won a ${result}`);

        notifications.add({ text: `${result} won`, priority: 1 });
      } else {
        flashMessages.errorFlashMessage(`You do not want your prize?`);
      }
    },

    async destroyPlanet() {
      const result = await modals.showModal(
        planetModal,
        {
          title: "Pick planet",
          description: "Please select a planet to destroy"
        },
        {
          plea: "Have mercy!"
        }
      );

      if (result !== "CANCELLED") {
        const confirmation = await confirmationDialog.confirmDialog(
          `Are you really really double extra sure you want to destroy ${result}, it is a planet after all?`
        );

        if (confirmation) {
          flashMessages.successFlashMessage(`You destoyed ${result}`);

          notifications.add({
            text: `Planet ${result} destroyed`,
            priority: 0,
            buttons: [
              {
                label: "Restore",
                onClick: (event, view) => {
                  flashMessages.successFlashMessage(
                    `Planet ${result} restored`
                  );

                  view.dismiss(undefined);
                }
              }
            ]
          });
        }
      } else {
        flashMessages.infoFlashMessage(`You spared the planets.`);
      }
    }
  }));
});
