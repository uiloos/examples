import { ViewChannel } from '@uiloos/core';
import { ModalComponent, ModalData } from './types';
import { Injectable, Type } from '@angular/core';

// A symbol which represents a modal's result being
// cancelled. By using a Symbol here we make sure we
// never accidentally collide with any success result
// coming from the actual modals.
export const modalCancelled = Symbol('modal cancelled');

@Injectable()
export class ModalService {
  public modalChannel: ViewChannel<ModalData<any>, any> = new ViewChannel();

  // By using the generics like the ViewChannelView data is
  // different for each modal presented.
  showModal<D, R>(
    component: Type<ModalComponent<R, D>>,
    info: {
      title: string;
      description: string;
    },
    data: D
  ): Promise<R | typeof modalCancelled> {
    const view = this.modalChannel.present({
      data: {
        id: Math.random(),
        info,
        component,
        data
      }
    });

    return (view.result as unknown) as Promise<R | typeof modalCancelled>;
  }
}
