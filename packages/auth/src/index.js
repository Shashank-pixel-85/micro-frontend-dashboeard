const SESSION_KEY = 'mfd_session';

export function getSession() {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export function login(email) {
  const session = {
    email,
    name: email.split('@')[0] || 'User',
    token: `demo-${Date.now()}`,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('mfe:auth-changed', { detail: session }));

  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('mfe:auth-changed', { detail: null }));
}
