import { API_BASE, publishUserUpdated } from '@mfd/utils';

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getUsers() {
  return request('/users');
}

export async function updateUser(user) {
  const updatedUser = await request(`/users/${user.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `${user.name} ✓` }),
  });

  publishUserUpdated(updatedUser);
  return updatedUser;
}
