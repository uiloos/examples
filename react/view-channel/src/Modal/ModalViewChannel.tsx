import { useViewChannel } from '@uiloos/react';
import { modalChannel } from './modal-service';
import { ModalWrapper } from './ModalWrapper';

import './modal.css';

export function ModalViewChannel() {
  // Via useViewChannel we make sure this component re-renders
  // whenever the ViewChannel changes.
  const modals = useViewChannel(modalChannel);

  if (modals.views.length === 0) {
    return null;
  }

  return (
    <>
      {modals.views.map((view) => {
        const Component = view.data.component;

        return (
          <ModalWrapper key={view.data.id} view={view}>
            <Component {...view.data.props} view={view} />
          </ModalWrapper>
        );
      })}
    </>
  );
}
