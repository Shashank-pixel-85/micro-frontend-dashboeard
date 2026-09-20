import { API_BASE } from '@mfd/utils';

export async function getTodos() {
  const response = await fetch(`${API_BASE}/todos`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
