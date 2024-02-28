import { ViewChannel } from '@uiloos/core';

import { NotificationButton, NotificationData } from './types';

export type NotificationConfig = {
  text: string;
  buttons?: NotificationButton[];
  priority?: number | number[];
};

export const notificationChannel: ViewChannel<
  NotificationData,
  undefined
> = new ViewChannel();

export function addNotification({
  priority = 0,
  text,
  buttons = []
}: NotificationConfig): void {
  notificationChannel.present({
    priority,
    data: {
      id: Math.random(),
      text,
      buttons
    }
  });
}
