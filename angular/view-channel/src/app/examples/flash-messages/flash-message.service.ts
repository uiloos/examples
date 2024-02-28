import { ViewChannel } from '@uiloos/core';
import { FlashMessageData } from './types';
import { Injectable } from '@angular/core';

@Injectable()
export class FlashMessageService {
  public flashMessageChannel = new ViewChannel<FlashMessageData, undefined>();

  infoFlashMessage(text: string): void {
    this.flashMessageChannel.present({
      data: {
        id: Math.random(),
        text,
        type: 'info'
      },
      priority: 4,
      autoDismiss: {
        duration: 2000,
        result: undefined
      }
    });
  }

  warningFlashMessage(text: string): void {
    this.flashMessageChannel.present({
      data: {
        id: Math.random(),
        text,
        type: 'warning'
      },
      priority: 1,
      autoDismiss: {
        duration: 3000,
        result: undefined
      }
    });
  }

  errorFlashMessage(text: string): void {
    this.flashMessageChannel.present({
      data: {
        id: Math.random(),
        text,
        type: 'error'
      },
      priority: 0,
      autoDismiss: {
        duration: 5000,
        result: undefined
      }
    });
  }

  successFlashMessage(text: string): void {
    this.flashMessageChannel.present({
      data: {
        id: Math.random(),
        text,
        type: 'success'
      },
      priority: 2,
      autoDismiss: {
        duration: 2000,
        result: undefined
      }
    });
  }
}
