import { addNotification } from '/scripts/notification.js';
import { confirmDialog } from '/scripts/confirm-dialog.js';
import { showModal, modalCancelled } from '/scripts/modal.js';
import {
  infoFlashMessage,
  successFlashMessage,
  warningFlashMessage,
  errorFlashMessage
} from '/scripts/flash-message.js';

import { pokemonModal } from '/scripts/example-modals/pokemon-modal.js';
import { planetModal } from '/scripts/example-modals/planet-modal.js';
import { carModal } from '/scripts/example-modals/car-modal.js';

document.getElementById('pokemonButton').onclick = async () => {
  const result = await showModal(
    pokemonModal,
    {
      title: 'Pick pokemon',
      description: 'Please select your starter pokemon'
    },
    {
      text: 'Choose wisely!'
    }
  );

  if (result !== modalCancelled) {
    infoFlashMessage(`You start you adventure with ${result}`);

    addNotification({
      text: `Pokemon adventure started with ${result}`,
      priority: 2
    });
  } else {
    warningFlashMessage('You declined to go on an adventure.');
  }
};

document.getElementById('carButton').onclick = async () => {
  const result = await showModal(
    carModal,
    {
      title: 'Pick car',
      description: 'Please select your prize'
    },
    {}
  );

  if (result !== modalCancelled) {
    successFlashMessage(`You won a ${result}`);

    addNotification({ text: `${result} won`, priority: 1 });
  } else {
    errorFlashMessage(`You do not want your prize?`);
  }
};

document.getElementById('planetButton').onclick = async () => {
  const result = await showModal(
    planetModal,
    {
      title: 'Pick planet',
      description: 'Please select a planet to destroy'
    },
    {
      plea: 'Have mercy!'
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
            label: 'Restore',
            onClick: (event, view) => {
              successFlashMessage(`Planet ${result} restored`);

              view.dismiss(undefined);
            }
          }
        ]
      });
    }
  } else {
    infoFlashMessage(`You spared the planets.`);
  }
};
