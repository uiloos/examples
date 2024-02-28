import { Injectable } from '@angular/core';
import { ViewChannel } from '@uiloos/core';
import { ConfirmationData } from './types';

@Injectable()
export class ConfirmationDialogService {
  public confirmationDialogChannel = new ViewChannel<
    ConfirmationData,
    boolean
  >();

  confirmDialog(text: string): Promise<boolean> {
    return this.confirmationDialogChannel.present({
      data: {
        id: Math.random(),
        text
      }
    }).result;
  }
}
