import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSession, logout } from '@mfd/auth';
import { Card, Spinner } from '@mfd/ui';
import './styles.css';

const Auth = lazy(() => import('auth/Auth'));
const Dashboard = lazy(() => import('dashboard/App'));
const Users = lazy(() => import('users/App'));
const Analytics = lazy(() => import('analytics/App'));
const Notifications = lazy(() => import('notifications/App'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

const navigationItems = [
  { path: '/', label: 'Overview', icon: '⌂' },
  { path: '/users', label: 'Users', icon: '◉' },
  { path: '/analytics', label: 'Analytics', icon: '◒' },
  { path: '/notifications', label: 'Notifications', icon: '◌' },
];

class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-fallback">
          <h2>{this.props.name} module unavailable</h2>
          <p>The remote application could not be loaded.</p>
          <button className="btn btn-secondary" onClick={this.handleReload}>
            Reload module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function Remote({ name, children }) {
  return (
    <RemoteErrorBoundary name={name}>
      <Suspense
        fallback={
          <div className="remote-fallback">
            <Spinner />
            <p>Loading {name} module...</p>
          </div>
        }
      >
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  );
}

function AuthenticationScreen() {
  return (
    <Remote name="Authentication">
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    </Remote>
  );
}

function Sidebar({ session }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">Micro-Frontend Dashboard</span>
      </div>

      <nav className="navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <span>{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="profile">
        <div className="avatar">{session.name[0].toUpperCase()}</div>
        <div className="profile-copy">
          <strong>{session.name}</strong>
          <small>{session.email}</small>
        </div>
        <button className="logout" onClick={handleLogout} aria-label="Log out">
          ↪
        </button>
      </div>
    </aside>
  );
}

function PageHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentItem = navigationItems.find((item) => item.path === location.pathname);
  const title = currentItem?.label || 'Overview';

  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">Workspace</span>
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        <span className="live-status">
          <i /> Live
        </span>
        <button
          className="icon-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Open notifications"
        >
          ♢
        </button>
      </div>
    </header>
  );
}

function ApplicationShell({ session }) {
  return (
    <div className="shell">
      <Sidebar session={session} />

      <main className="main-content">
        <PageHeader />

        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={
                <Remote name="Dashboard">
                  <Dashboard />
                </Remote>
              }
            />
            <Route
              path="/users"
              element={
                <Remote name="User Management">
                  <Users />
                </Remote>
              }
            />
            <Route
              path="/analytics"
              element={
                <Remote name="Analytics">
                  <Analytics />
                </Remote>
              }
            />
            <Route
              path="/notifications"
              element={
                <Remote name="Notifications">
                  <Notifications />
                </Remote>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    const handleAuthChange = (event) => {
      setSession(event.detail || null);
    };

    window.addEventListener('mfe:auth-changed', handleAuthChange);
    return () => window.removeEventListener('mfe:auth-changed', handleAuthChange);
  }, []);

  if (!session) {
    return <AuthenticationScreen />;
  }

  return <ApplicationShell session={session} />;
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
