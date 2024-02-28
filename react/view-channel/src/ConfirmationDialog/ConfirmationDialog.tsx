import { ConfirmationData } from './types';
import { ViewChannelView } from '@uiloos/core';

type Props = {
  view: ViewChannelView<ConfirmationData, boolean>;
};

export function ConfirmationDialog({ view }: Props) {
  function onOkClicked() {
    view.dismiss(true);
  }

  function onCancelClicked() {
    view.dismiss(false);
  }

  const confirm = view.data;

  return (
    <>
      <div
        className="confirmation-dialog-backdrop"
        onClick={onCancelClicked}
      ></div>

      <div
        className="confirmation-dialog"
        role="dialog"
        aria-label="Please confirm"
        aria-describedby="confirm-text"
      >
        <strong>Please confirm</strong>
        <p id="confirm-text">{confirm.text}</p>

        <div className="confirmation-dialog-button-bar">
          <button onClick={onOkClicked}>Ok</button>
          <button onClick={onCancelClicked}>Cancel</button>
        </div>
      </div>
    </>
  );
}
