import { Component, Input } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { FlashMessageData } from '../types';
import { FlashMessageProgressComponent } from '../flash-message-progress/flash-message-progress.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FlashMessageProgressComponent
  ]
})
export class FlashMessageComponent {
  @Input() view!: ViewChannelView<FlashMessageData, undefined>;

  getZIndex() {
    return this.view.viewChannel.views.length - this.view.index;
  }

  getSymbol(): string {
    switch (this.view.data.type) {
      case 'info':
        return 'ⓘ';

      case 'warning':
        return '⚠';

      case 'error':
        return '☠';

      case 'success':
        return '✓';
    }
  }
}
