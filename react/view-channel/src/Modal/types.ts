import { ViewChannelView } from '@uiloos/core';

// The properties the component should actually have,
// it should always have a view property, and any
// property (P) it needs to render.
export type ModalComponentProps<P, R> = P & {
  view: ViewChannelView<ModalData<unknown, R>, R>;
};

// A component which takes ModalComponentProps returns a
// modal component.
export type ModalComponent<P, R> = (
  props: ModalComponentProps<P, R>
) => JSX.Element;

// Properties needed to render the modal
export type ModalInfo = {
  title: string;
  description: string;
};

// Props for the showModal function so it can push a modal component
// onto the ViewChannel
export type ModalData<P, R> = {
  id: number;
  component: ModalComponent<P, R>;
  props: P;
  info: ModalInfo;
};
