import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

const defaultRemotes = {
  auth: 'http://localhost:3001/assets/remoteEntry.js',
  dashboard: 'http://localhost:3002/assets/remoteEntry.js',
  users: 'http://localhost:3003/assets/remoteEntry.js',
  analytics: 'http://localhost:3004/assets/remoteEntry.js',
  notifications: 'http://localhost:3005/assets/remoteEntry.js',
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const remotes = {
    auth: env.VITE_AUTH_REMOTE || defaultRemotes.auth,
    dashboard: env.VITE_DASHBOARD_REMOTE || defaultRemotes.dashboard,
    users: env.VITE_USERS_REMOTE || defaultRemotes.users,
    analytics: env.VITE_ANALYTICS_REMOTE || defaultRemotes.analytics,
    notifications: env.VITE_NOTIFICATIONS_REMOTE || defaultRemotes.notifications,
  };

  return {
    plugins: [
      react(),
      federation({
        name: 'host',
        remotes,
        shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
      }),
    ],
    server: { port: 3000 },
    build: { target: 'esnext' },
  };
});
