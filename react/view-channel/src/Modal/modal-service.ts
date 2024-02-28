import { ViewChannel } from '@uiloos/core';
import { ModalData, ModalComponent, ModalInfo } from './types';

// Create a ViewChannel which does not know beforehand what
// the contained ViewChannelView data will be.
export const modalChannel: ViewChannel<ModalData<
  any,
  any
>> = new ViewChannel();

// A symbol which represents a modal's result being
// cancelled. By using a Symbol here we make sure we
// never accidentally collide with any success result
// coming from the actual modals.
export const modalCancelled = Symbol('modal cancelled');

// By using the generics like the ViewChannelView data is
// different for each modal presented.
export function showModal<P, R>(
  component: ModalComponent<P, R>,
  info: ModalInfo,
  props: P
): Promise<R | typeof modalCancelled> {
  const view = modalChannel.present({
    data: {
      id: Math.random(),
      component,
      props,
      info
    }
  });

  return (view.result as unknown) as Promise<R | typeof modalCancelled>;
}
