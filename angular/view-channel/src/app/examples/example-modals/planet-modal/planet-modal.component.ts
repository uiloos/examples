import { Component, Input } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ModalComponent, ModalData } from '../../modal/types';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

type PlanetModalResult = 'earth' | 'mars' | 'venus';

type PlanetModalComponentData = {
  plea: string;
};

@Component({
  selector: 'planet-modal',
  templateUrl: './planet-modal.component.html',
  standalone: true
})
export class PlanetModalComponent
  implements ModalComponent<PlanetModalResult, PlanetModalComponentData> {
  @Input() view!: ViewChannelView<
    ModalData<PlanetModalComponentData>,
    PlanetModalResult
  >;

  @Input() data!: PlanetModalComponentData;

  private confirmationDialogService: ConfirmationDialogService;

  constructor(confirmationDialogService: ConfirmationDialogService) {
    this.confirmationDialogService = confirmationDialogService;
  }

  async destroy(planet: PlanetModalResult) {
    const confirmation = await this.confirmationDialogService.confirmDialog(
      `Are you sure you want to destroy ${planet}`
    );

    if (confirmation) {
      this.view.dismiss(planet);
    }
  }
}
