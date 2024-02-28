import { ReactNode, useEffect } from 'react';
import { ViewChannelView } from '@uiloos/core';
import { modalCancelled } from './modal-service';
import { ModalData } from './types';

type Props = {
  children: ReactNode;
  view: ViewChannelView<ModalData<any, any>, any>;
};

/**
 * A component which contains the common things in every modal:
 * a backdrop and a close button.
 */
export function ModalWrapper({ view, children }: Props) {
  function onCancelClicked() {
    view.dismiss(modalCancelled);
  }

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancelClicked();
      }
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  });

  return (
    <>
      <div className="modal-backdrop" onClick={onCancelClicked}></div>

      <div
        className="modal"
        role="dialog"
        aria-label={view.data.info.title}
        aria-describedby="modal-description"
      >
        <button
          className="modal-close"
          onClick={onCancelClicked}
          aria-label="Close modal"
        >
          ✖
        </button>

        <h1>{view.data.info.title}</h1>

        <p id="modal-description">{view.data.info.description}</p>

        {children}
      </div>
    </>
  );
}
