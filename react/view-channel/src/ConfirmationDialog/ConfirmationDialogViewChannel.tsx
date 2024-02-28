import { useViewChannel } from '@uiloos/react';
import { confirmationDialogChannel } from './confirmation-service';
import { ConfirmationDialog } from './ConfirmationDialog';

import './confirmation-dialog.css';

export function ConfirmationDialogViewChannel() {
  // Via useViewChannel we make sure this component re-renders
  // whenever the ViewChannel changes.
  const confirmations = useViewChannel(confirmationDialogChannel);

  if (confirmations.views.length === 0) {
    return null;
  }

  return (
    <>
      {confirmations.views.map((view) => (
        <ConfirmationDialog key={view.data.id} view={view} />
      ))}
    </>
  );
}
