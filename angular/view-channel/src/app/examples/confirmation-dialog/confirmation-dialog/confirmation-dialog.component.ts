import { Component, Input } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ConfirmationData } from '../types';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  standalone: true
})
export class ConfirmationDialogComponent {
  @Input() view!: ViewChannelView<ConfirmationData, boolean>;

  onOkClicked() {
    this.view.dismiss(true);
  }

  onCancelClicked() {
    this.view.dismiss(false);
  }
}
