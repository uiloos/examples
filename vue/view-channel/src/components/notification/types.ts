import { ViewChannelView } from '@uiloos/core';

export type NotificationButton = {
  label: string;
  onClick(
    event: Event,
    view: ViewChannelView<NotificationData, undefined>
  ): void;
};

export type NotificationData = {
  id: number;
  text: string;
  buttons: NotificationButton[];
};
