import { ViewChannelView } from '@uiloos/core';
import { MouseEvent } from 'react';

export type NotificationButton = {
  label: string;
  onClick(
    event: MouseEvent,
    view: ViewChannelView<NotificationData, undefined>
  ): void;
};

export type NotificationData = {
  id: number;
  text: string;
  buttons: NotificationButton[];
};
