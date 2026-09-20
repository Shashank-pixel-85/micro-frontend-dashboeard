import React from 'react';
import { Badge, EmptyState } from '@mfd/ui';

export default function UserTable({ users, isUpdating, onUpdate }) {
  if (users.length === 0) {
    return <EmptyState title="No users found" text="Try a different search term." />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Company</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="person">
                  <span>{user.name[0]}</span>
                  <strong>{user.name}</strong>
                </div>
              </td>
              <td>{user.company.name}</td>
              <td>{user.email}</td>
              <td><Badge>Member</Badge></td>
              <td><Badge tone="success">Active</Badge></td>
              <td>
                <button
                  className="edit-button"
                  disabled={isUpdating}
                  onClick={() => onUpdate(user)}
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
