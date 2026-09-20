import React from 'react';
import { Badge } from '@mfd/ui';

export default function NotificationItem({ notification, onDismiss }) {
  return (
    <div className={notification.read ? 'notification read' : 'notification'}>
      <div className="notification-dot" />
      <div className="notification-copy">
        <div className="notification-title">
          <strong>{notification.title}</strong>
          {!notification.read && <Badge tone="success">New</Badge>}
        </div>
        <p>{notification.text}</p>
        <small>{notification.time}</small>
      </div>
      <button className="dismiss" onClick={() => onDismiss(notification.id)} aria-label={`Dismiss ${notification.title}`}>
        ×
      </button>
    </div>
  );
}
