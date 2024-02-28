import { Injectable } from '@angular/core';
import { ViewChannel } from '@uiloos/core';
import { NotificationButton, NotificationData } from './types';

export type NotificationConfig = {
  text: string;
  buttons?: NotificationButton[];
  priority?: number | number[];
};

@Injectable()
export class NotificationService {
  public notificationChannel: ViewChannel<
    NotificationData,
    undefined
  > = new ViewChannel();

  addNotification({
    priority = 0,
    text,
    buttons = []
  }: NotificationConfig): void {
    this.notificationChannel.present({
      priority,
      data: {
        id: Math.random(),
        text,
        buttons
      }
    });
  }
}
