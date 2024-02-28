import { Component } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { ModalService } from '../modal.service';
import { ModalWrapperComponent } from '../modal-wrapper/modal-wrapper.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'modal-view-channel',
  template: `
    <span *ngFor="let view of views">
      <modal-wrapper [view]="view"></modal-wrapper>
    </span>
  `,
  standalone: true,
  imports: [CommonModule, ModalWrapperComponent],
})
export class ModalViewChannelComponent {
  public views: ViewChannelView<any, any>[];

  constructor(modalService: ModalService) {
    this.views = modalService.modalChannel.views;
  }
}
