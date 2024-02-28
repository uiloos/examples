import { ViewChannelView } from '@uiloos/core';
import { NotificationData } from './types';

import './notification.css';

type Props = {
  view: ViewChannelView<NotificationData, undefined>;
};

export function Notification({ view }: Props) {
  const notification = view.data;

  return (
    <div className="notification">
      {notification.text}

      <div className="notification-buttons">
        <button
          onClick={(event) => view.dismiss(undefined)}
          className="notification-button"
        >
          Clear
        </button>
        {notification.buttons.map((btn, index) => (
          <button
            key={index}
            onClick={(event) => btn.onClick(event, view)}
            className="notification-button"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
