import { Component } from '@angular/core';
import { ConfirmationDialogService } from './examples/confirmation-dialog/confirmation-dialog.service';
import { FlashMessageService } from './examples/flash-messages/flash-message.service';
import { modalCancelled, ModalService } from './examples/modal/modal.service';
import { NotificationService } from './examples/notification/notification.service';

import { PlanetModalComponent } from './examples/example-modals/planet-modal/planet-modal.component';
import { CarModalComponent } from './examples/example-modals/car-modal/car-modal.component';
import { PokemonModalComponent } from './examples/example-modals/pokemon-modal/pokemon-modal.component';
import { ConfirmationDialogViewChannelComponent } from './examples/confirmation-dialog/confirmation-dialog-view-channel/confirmation-dialog-view-channel.component';
import { FlashMessageViewChannelComponent } from './examples/flash-messages/flash-message-view-channel/flash-message-view-channel.component';
import { ModalViewChannelComponent } from './examples/modal/modal-view-channel/modal-view-channel.component';
import { NotificationViewChannelComponent } from './examples/notification/notification-view-channel/notification-view-channel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    AppComponent,

    CarModalComponent,
    PlanetModalComponent,
    PokemonModalComponent,

    NotificationViewChannelComponent,
    ModalViewChannelComponent,
    FlashMessageViewChannelComponent,
    ConfirmationDialogViewChannelComponent
  ],
  providers: [
    ConfirmationDialogService,
    NotificationService,
    FlashMessageService,
    ModalService
  ]
})
export class AppComponent {
  private confirmationDialogService: ConfirmationDialogService;
  private modalService: ModalService;
  private flashMessageService: FlashMessageService;
  private notificationService: NotificationService;

  constructor(
    confirmationDialogService: ConfirmationDialogService,
    modalService: ModalService,
    flashMessageService: FlashMessageService,
    notificationService: NotificationService
  ) {
    this.confirmationDialogService = confirmationDialogService;
    this.modalService = modalService;
    this.flashMessageService = flashMessageService;
    this.notificationService = notificationService;
  }

  async onPickPokemon() {
    const result = await this.modalService.showModal(
      PokemonModalComponent,
      {
        title: 'Pick pokemon',
        description: 'Please select your starter pokemon'
      },
      {
        text: 'Choose wisely'
      }
    );

    if (result !== modalCancelled) {
      this.flashMessageService.infoFlashMessage(
        `You start you adventure with ${result}`
      );

      this.notificationService.addNotification({
        text: `Pokemon adventure started with ${result}`,
        priority: 2
      });
    } else {
      this.flashMessageService.warningFlashMessage(
        'You declined to go on an adventure.'
      );
    }
  }

  async onPickCar() {
    const result = await this.modalService.showModal(
      CarModalComponent,
      {
        title: 'Pick car',
        description: 'Please select your prize'
      },
      {}
    );

    if (result !== modalCancelled) {
      this.flashMessageService.successFlashMessage(`You won a ${result}`);

      this.notificationService.addNotification({
        text: `${result} won`,
        priority: 1
      });
    } else {
      this.flashMessageService.errorFlashMessage(`You do not want your prize?`);
    }
  }

  async onPickPlanet() {
    const result = await this.modalService.showModal(
      PlanetModalComponent,
      {
        title: 'Pick planet',
        description: 'Please select a planet to destroy'
      },
      {
        plea: 'Have mercy!'
      }
    );

    if (result !== modalCancelled) {
      const confirmation = await this.confirmationDialogService.confirmDialog(
        `Are you really really double extra sure you want to destroy ${result}, it is a planet after all?`
      );

      if (confirmation) {
        this.flashMessageService.successFlashMessage(`You destoyed ${result}`);

        this.notificationService.addNotification({
          text: `Planet ${result} destroyed`,
          priority: 0,
          buttons: [
            {
              label: 'Restore',
              onClick: (event, notification) => {
                this.flashMessageService.successFlashMessage(
                  `Planet ${result} restored`
                );

                notification.dismiss(undefined);
              }
            }
          ]
        });
      }
    } else {
      this.flashMessageService.infoFlashMessage(`You spared the planets.`);
    }
  }
}
