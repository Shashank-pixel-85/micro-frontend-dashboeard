export const API_BASE = 'https://jsonplaceholder.typicode.com';

const LAST_USER_UPDATE_KEY = 'mfd_last_user_update';

export function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on(name, handler) {
  window.addEventListener(name, handler);

  return () => {
    window.removeEventListener(name, handler);
  };
}

export function publishUserUpdated(user) {
  const event = {
    user,
    timestamp: Date.now(),
  };

  localStorage.setItem(LAST_USER_UPDATE_KEY, JSON.stringify(event));
  emit('mfe:user-updated', event);
}

export function getLastUserUpdate() {
  try {
    const value = localStorage.getItem(LAST_USER_UPDATE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}
