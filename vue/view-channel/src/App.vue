

<template>
  <div class="App">
    <div class="main">
      <h1>ViewChannel</h1>
      <h2>Press the buttons to trigger a modal</h2>

      <button @click="onPickPokemon()">Pick Pokemon</button>

      <button @click="onPickCar()">Pick Car</button>

      <button @click="onPickPlanet()">Destroy Planet</button>

      <p>Tip: hover over flash messages to pause them</p>
    </div>

    <NotificationViewChannel />
  </div>

  <FlashMessageViewChannel />

  <ModalViewChannel />

  <ConfirmationDialogViewChannel />
</template>

<script setup lang="ts">
import NotificationViewChannel from "./components/notification/NotificationViewChannel.vue";
import ModalViewChannel from "./components/modal/ModalViewChannel.vue";
import ConfirmationDialogViewChannel from "./components/confirm-dialog/ConfirmationDialogViewChannel.vue";
import FlashMessageViewChannel from "./components/flash-message/FlashMessageViewChannel.vue";

import CarModal from "./components/example-modals/CarModal.vue";
import PokemonModal from "./components/example-modals/PokemonModal.vue";
import PlanetModal from "./components/example-modals/PlanetModal.vue";

import {
  addNotification,
} from "./components/notification/notification-service";
import { modalCancelled, showModal } from "./components/modal/modal-service";
import { confirmDialog } from "./components/confirm-dialog/confirm-dialog-service";
import {
  errorFlashMessage,
  infoFlashMessage,
  successFlashMessage,
  warningFlashMessage,
} from "./components/flash-message/flash-message-service";

async function onPickPokemon() {
  const result = await showModal(
    PokemonModal,
    {
      title: "Pick pokemon",
      description: "Please select your starter pokemon",
    },
    {
      text: "Choose wisely",
    }
  );
  if (result !== modalCancelled) {
    infoFlashMessage(`You start you adventure with ${result}`);
    addNotification({
      text: `Pokemon adventure started with ${result}`,
      priority: 2,
    });
  } else {
    warningFlashMessage("You declined to go on an adventure.");
  }
}

async function onPickCar() {
  const result = await showModal(
    CarModal,
    {
      title: "Pick car",
      description: "Please select your prize",
    },
    {}
  );

  if (result !== modalCancelled) {
    successFlashMessage(`You won a ${result}`);

    addNotification({
      text: `${result} won`,
      priority: 1,
    });
  } else {
    errorFlashMessage(`You do not want your prize?`);
  }
}

async function onPickPlanet() {
  const result = await showModal(
    PlanetModal,
    {
      title: "Pick planet",
      description: "Please select a planet to destroy",
    },
    {
      plea: "Have mercy!",
    }
  );

  if (result !== modalCancelled) {
    const confirmation = await confirmDialog(
      `Are you really really double extra sure you want to destroy ${result}, it is a planet after all?`
    );

    if (confirmation) {
      successFlashMessage(`You destoyed ${result}`);

      addNotification({
        text: `Planet ${result} destroyed`,
        priority: 0,
        buttons: [
          {
            label: "Restore",
            onClick: (event, notification) => {
              successFlashMessage(`Planet ${result} restored`);

              notification.dismiss(undefined);
            },
          },
        ],
      });
    }
  } else {
    infoFlashMessage(`You spared the planets.`);
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: sans-serif;
}

.App {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

button {
  margin: 0 2px;
}
</style>