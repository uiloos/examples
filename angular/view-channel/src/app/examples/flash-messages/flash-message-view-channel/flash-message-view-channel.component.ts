import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { FlashMessageService } from '../flash-message.service';
import { FlashMessageData } from '../types';
import { FlashMessageComponent } from '../flash-message/flash-message.component';
import { CommonModule } from '@angular/common';

const ANIMATION_DURATION = 200;

@Component({
  selector: 'flash-message-view-channel',
  template: `
    <div role="status" aria-live="polite">
      <div *ngFor="let view of views" @slide>
        <flash-message [view]="view"></flash-message>
      </div>
    </div>
  `,
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({
          visibility: 'visible',
          transform: 'translate3d(0, -100%, 0)',
        }),
        animate(
          ANIMATION_DURATION,
          style({ transform: 'translate3d(0, 0, 0)' })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'translate3d(0, 0, 0)',
          opacity: 1,
          visibility: 'visible',
        }),
        animate(
          ANIMATION_DURATION,
          style({
            transform: 'translate3d(0, -100%, 0)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, FlashMessageComponent],
})
export class FlashMessageViewChannelComponent {
  public views: ViewChannelView<FlashMessageData, undefined>[];

  constructor(flashMessageService: FlashMessageService) {
    this.views = flashMessageService.flashMessageChannel.views;
  }
}
