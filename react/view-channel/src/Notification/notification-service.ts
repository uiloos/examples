import { ViewChannel } from '@uiloos/core';
import { NotificationData, NotificationButton } from './types';

export const notificationChannel: ViewChannel<
  NotificationData,
  undefined
> = new ViewChannel();

export type NotificationConfig = {
  text: string;
  buttons?: NotificationButton[];
  priority?: number | number[];
};

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
