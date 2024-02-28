import type { ViewChannelView } from '@uiloos/core';
import type { ComponentType } from 'svelte';

// The properties the component should actually have,
// it should always have a view property, and any
// data (D) it needs to render.
export interface ModalComponent<R, D> {
  view: ViewChannelView<ModalData<R, D>, R>;
  data: D;
}

// Properties needed to render the modal
export type ModalInfo = {
  title: string;
  description: string;
};

// Props for the showModal function so it can push a modal component
// onto the ViewChannel
export type ModalData<R, D> = {
  id: number;
  component: ComponentType;
  data: D;
  info: ModalInfo;
};
