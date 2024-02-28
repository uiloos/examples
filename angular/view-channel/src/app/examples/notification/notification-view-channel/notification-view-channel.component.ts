import { Component } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { NotificationService } from '../notification.service';
import { NotificationData } from '../types';
import { NotificationComponent } from '../notification/notification.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'notification-view-channel',
  templateUrl: './notification-view-channel.component.html',
  styleUrls: ['./notification-view-channel.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent
  ]
})
export class NotificationViewChannelComponent {
  private notificationService: NotificationService;
  public views: ViewChannelView<NotificationData, undefined>[];

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
    this.views = notificationService.notificationChannel.views;
  }

  dismissAll() {
    this.notificationService.notificationChannel.dismissAll(undefined);
  }
}
