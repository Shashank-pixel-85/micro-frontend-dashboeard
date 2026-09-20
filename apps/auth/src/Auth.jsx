import React, { useState } from 'react';
import { login } from '@mfd/auth';
import { Button } from '@mfd/ui';
import './styles.css';

function AuthForm() {
  const [email, setEmail] = useState('shashank@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    login(email.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && <div className="form-error">{error}</div>}

      <Button type="submit" className="full">
        Sign in to dashboard →
      </Button>
    </form>
  );
}

export default function Auth() {
  return (
    <div className="auth">
      <div className="auth-panel">
        <div className="auth-mark">◈</div>
        <h1>Welcome back</h1>
        <p>Sign in to your workspace.</p>
        <AuthForm />
        <small>Shashank authentication • any non-empty credentials</small>
      </div>

      <div className="auth-art">
        <div className="orb">◒</div>
        <h2>One workspace.<br />Every signal.</h2>
        <p>Monitor customers, operations and growth from one responsive command center.</p>
      </div>
    </div>
  );
}
