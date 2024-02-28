import { CarModal } from './ExampleModals/CarModal';
import { PokemonModal } from './ExampleModals/PokemonModal';
import { PlanetModal } from './ExampleModals/PlanetModal';
import { modalCancelled, showModal } from './Modal/modal-service';
import {
  errorFlashMessage,
  infoFlashMessage,
  successFlashMessage,
  warningFlashMessage
} from './FlashMessages/flash-message-service';
import { confirmDialog } from './ConfirmationDialog/confirmation-service';
import { NotificationViewChannel } from './Notification/NotificationViewChannel';
import { addNotification } from './Notification/notification-service';

export default function App() {
  async function onPickPokemon() {
    const result = await showModal(
      PokemonModal,
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
  }

  async function onPickCar() {
    const result = await showModal(
      CarModal,
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
  }

  async function onPickPlanet() {
    const result = await showModal(
      PlanetModal,
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
  }

  return (
    <div className="App">
      <div className="main">
        <h1>ViewChannel</h1>
        <h2>Press the buttons to trigger a modal</h2>

        <button onClick={onPickPokemon}>Pick Pokemon</button>

        <button onClick={onPickCar}>Pick Car</button>

        <button onClick={onPickPlanet}>Destroy Planet</button>

        <p>Tip: hover over flash messages to pause them</p>
      </div>

      <NotificationViewChannel />
    </div>
  );
}
