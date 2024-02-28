import { useViewChannel } from '@uiloos/react';
import { notificationChannel } from './notification-service';
import { Notification } from './Notification';

export function NotificationViewChannel() {
  // Via useViewChannel we make sure this component re-renders
  // whenever the ViewChannel changes.
  const notifications = useViewChannel(notificationChannel);

  return (
    <div className="notifications">
      {notifications.views.length ? (
        <button onClick={() => notifications.dismissAll(undefined)}>
          Clear all
        </button>
      ) : (
        <p>No notifications yet</p>
      )}

      <div role="status" aria-live="polite">
        {notifications.views.map((view) => (
          <Notification key={view.data.id} view={view} />
        ))}
      </div>
    </div>
  );
}
