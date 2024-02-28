import { ViewChannel } from '@uiloos/core';
import type { ComponentType } from 'svelte';
import type { ModalData, ModalComponent, ModalInfo } from './types';
// Create a ViewChannel which does not know beforehand what
// the contained ViewChannelView data will be.
export const modalChannel: ViewChannel<ModalData<unknown,unknown>> = new ViewChannel();

// A symbol which represents a modal's result being
// cancelled. By using a Symbol here we make sure we
// never accidentally collide with any success result
// coming from the actual modals.
export const modalCancelled = Symbol('modal cancelled');

// By using the generics the ViewChannelView data is
// different for each modal presented.
export function showModal<D, R>(
  component: ComponentType,
  info: ModalInfo,
  data: D
): Promise<R | typeof modalCancelled> {
  const view = modalChannel.present({
    data: {
      id: Math.random(),
      component,
      data,
      info
    }
  });

  return (view.result as unknown) as Promise<R | typeof modalCancelled>;
}
