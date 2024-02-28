import { Type } from '@angular/core';
import { ViewChannelView } from '@uiloos/core';

// The properties the component should actually have,
// it should always have a view property, and any
// props (D) it needs to render.
export interface ModalComponent<R, D> {
  view: ViewChannelView<ModalData<D>, R>;
  data: D;
}

// Properties needed to render the modal
export type ModalInfo = {
  title: string;
  description: string;
};

// Props for the showModal function so it can push a modal component
// onto the ViewChannel
export type ModalData<D> = {
  id: number;
  component: Type<ModalComponent<any, D>>;
  data: D;
  info: ModalInfo;
};
