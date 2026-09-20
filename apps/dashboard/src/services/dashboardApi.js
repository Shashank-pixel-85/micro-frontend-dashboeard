import { API_BASE } from '@mfd/utils';

async function get(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getUsers() {
  return get('/users');
}

export function getPosts() {
  return get('/posts');
}
