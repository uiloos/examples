import { Component, Input } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { NotificationData } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class NotificationComponent {
  @Input() view!: ViewChannelView<NotificationData, undefined>;

  onClearClicked() {
    this.view.dismiss(undefined);
  }
}
