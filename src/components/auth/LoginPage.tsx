import React, { useState } from 'react';
import type { FormEvent } from 'react';

import {
  GraduationCap,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  CircleAlert,
  CheckCircle2,
} from 'lucide-react';

import { api } from '../../services/api';
import { RegisterPage } from './RegisterPage';

interface LoginUser {
  id?: number | string;
  name?: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

interface LoginResponse {
  token?: string;
  user?: LoginUser;
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
}

interface LoginPageProps {
  onLogin: (user: LoginUser, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (showRegister) {
    return (
      <RegisterPage
        onBackToLogin={() => {
          setShowRegister(false);
          setError('');
        }}
      />
    );
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid =
    password.length >= 8 && /^[A-Z]/.test(password);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordValid) {
      setError(
        'Password must contain at least 8 characters and start with an uppercase letter.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = (await api.login({
        email: email.trim(),
        password,
      })) as LoginResponse;

      if (!response || !response.token) {
        throw new Error(
          'The server did not return an authentication token.'
        );
      }

      const user: LoginUser | undefined = response.user
        ? response.user
        : response.email && response.role
          ? {
              id: response.id,
              name: response.name,
              email: response.email,
              role: response.role,
            }
          : undefined;

      if (!user || !user.email || !user.role) {
        throw new Error(
          'User details are missing from the login response. Check the backend AuthResponse.'
        );
      }

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('active_role', user.role);

      onLogin(user, response.token);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-10">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">
              ApexPlace
            </h1>
            <p className="text-xs text-slate-500">
              Campus Placement Platform
            </p>
          </div>
        </div>

        <div className="mb-7">
          <h2 className="text-3xl font-black text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in using the email and password you registered with.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <CircleAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-bold text-slate-700 mb-1.5"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your registered email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-bold text-slate-700 mb-1.5"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-700 mb-2">
              Password requirements
            </p>

            <div className="space-y-1.5">
              <div
                className={
                  'flex items-center gap-2 text-xs ' +
                  (password.length >= 8
                    ? 'text-emerald-600'
                    : 'text-slate-500')
                }
              >
                <CheckCircle2 className="w-4 h-4" />
                Minimum 8 characters
              </div>

              <div
                className={
                  'flex items-center gap-2 text-xs ' +
                  (/^[A-Z]/.test(password)
                    ? 'text-emerald-600'
                    : 'text-slate-500')
                }
              >
                <CheckCircle2 className="w-4 h-4" />
                First character must be uppercase
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-slate-500">
            Don't have an account?{' '}
          </span>

          <button
            type="button"
            onClick={() => {
              setError('');
              setShowRegister(true);
            }}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-7">
          Secure access for the ApexPlace platform
        </p>
      </div>
    </div>
  );
};

