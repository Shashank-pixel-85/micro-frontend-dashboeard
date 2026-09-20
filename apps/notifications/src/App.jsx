import React, { useEffect, useState } from 'react';
import { Button, Card, EmptyState } from '@mfd/ui';
import { getLastUserUpdate, on } from '@mfd/utils';
import NotificationItem from './components/NotificationItem';
import './styles.css';

const initialNotifications = [
  {
    id: 1,
    title: 'Welcome to your workspace',
    text: 'Your workspace is ready to use.',
    time: 'Just now',
    read: false,
  },
  {
    id: 2,
    title: 'Analytics refreshed',
    text: 'The latest activity metrics are available.',
    time: '12 min ago',
    read: false,
  },
  {
    id: 3,
    title: 'Weekly report',
    text: 'Your workspace report is ready for review.',
    time: '2 hrs ago',
    read: true,
  },
];

function createUserUpdateNotification(event) {
  const name = event?.user?.name || 'A user';

  return {
    id: `user-update-${event?.timestamp || Date.now()}`,
    title: 'User updated',
    text: `${name} was updated in User Management.`,
    time: 'Just now',
    read: false,
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const lastUpdate = getLastUserUpdate();

    if (lastUpdate?.user) {
      setNotifications((current) => {
        const notification = createUserUpdateNotification(lastUpdate);
        const exists = current.some((item) => item.id === notification.id);
        return exists ? current : [notification, ...current];
      });
    }

    return on('mfe:user-updated', (event) => {
      setNotifications((current) => [
        createUserUpdateNotification(event.detail),
        ...current,
      ]);
    });
  }, []);

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  function dismissNotification(id) {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h2>Notifications</h2>
          <p>Cross-module activity and workspace alerts.</p>
        </div>
        <Button variant="secondary" onClick={markAllRead}>Mark all read</Button>
      </div>

      <Card className="notifications-card">
        {notifications.length === 0 ? (
          <EmptyState title="You're all caught up" text="No notifications to show." />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={dismissNotification}
            />
          ))
        )}
      </Card>

      <div className="communication-card">
        <span>↔</span>
        <div>
          <strong>Micro-frontend communication</strong>
          <p>Users publishes a shared event after a successful update. Notifications listens for that event and also restores the latest update from local storage.</p>
        </div>
      </div>
    </div>
  );
}
