import { Component, Input } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ModalComponent, ModalData } from '../../modal/types';

type CarModalResult = 'ford' | 'audi' | 'toyota';

@Component({
  selector: 'car-modal',
  templateUrl: './car-modal.component.html',
  standalone: true
})
export class CarModalComponent implements ModalComponent<CarModalResult, {}> {
  @Input() view!: ViewChannelView<ModalData<any>, CarModalResult>;

  @Input() data!: {};

  onCarClicked(car: CarModalResult) {
    this.view.dismiss(car);
  }
}
