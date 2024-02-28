import { ViewChannel } from '@uiloos/core';
import { ConfirmationData } from './types';

export const confirmationDialogChannel = new ViewChannel<
  ConfirmationData,
  boolean
>();

export function confirmDialog(text: string): Promise<boolean> {
  return confirmationDialogChannel.present({
    data: {
      id: Math.random(),
      text
    }
  }).result;
}
