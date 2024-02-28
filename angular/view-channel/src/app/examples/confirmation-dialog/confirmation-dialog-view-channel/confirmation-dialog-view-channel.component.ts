import { Component } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ConfirmationDialogService } from '../confirmation-dialog.service';
import { ConfirmationData } from '../types';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'confirmation-dialog-view-channel',
  template: `
    <span *ngFor="let view of views">
      <confirmation-dialog [view]="view"></confirmation-dialog>
    </span>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ConfirmationDialogComponent
  ],

})
export class ConfirmationDialogViewChannelComponent {
  public views: ViewChannelView<ConfirmationData, boolean>[];

  constructor(confirmationDialogService: ConfirmationDialogService) {
    this.views = confirmationDialogService.confirmationDialogChannel.views;
  }
}
