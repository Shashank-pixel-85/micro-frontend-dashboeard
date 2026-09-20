import React from 'react';

export default function ActivityList({ users }) {
  return (
    <div className="activity-list">
      {users.slice(0, 6).map((user, index) => (
        <div className="activity-row" key={user.id}>
          <div className="user-icon">{user.name[0]}</div>
          <div className="activity-copy">
            <strong>{user.name}</strong>
            <span>{user.company.name}</span>
          </div>
          <time>{index + 1}h ago</time>
        </div>
      ))}
    </div>
  );
}
