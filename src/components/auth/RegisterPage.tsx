import React, { useState } from 'react';
import {
  User,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Phone,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { UserRole } from '../../types';
import { api } from '../../services/api';

interface RegisterPageProps {
  onBackToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ROLE_STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanUsername = username.trim();
    const cleanCollegeId = collegeId.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Name is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanUsername.length < 3) {
      setError('Username must contain at least 3 characters.');
      return;
    }

    if (!cleanCollegeId) {
      setError('College ID is required.');
      return;
    }

    if (password.length < 8 || !/^[A-Z]/.test(password)) {
      setError(
        'Password must contain at least 8 characters and start with an uppercase letter.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await api.register({
        name: cleanName,
        email: cleanEmail,
        username: cleanUsername,
        collegeId: cleanCollegeId,
        password,
        role,
        phone: cleanPhone,
      });

      // Do not save the registration token or create a login session.
      alert(
        'Registration successful! Please log in with your registered email and password.'
      );

      onBackToLogin();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 px-12 py-3.5 outline-none focus:border-blue-500 disabled:bg-slate-100';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Register
          </h1>
          <p className="text-slate-500 mt-2">
            Create your ApexPlace account.
          </p>
        </div>

        <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl mb-7">
          {([
            ['ROLE_STUDENT', 'Student'],
            ['ROLE_RECRUITER', 'Recruiter'],
            ['ROLE_ADMIN', 'Placement Officer'],
          ] as [UserRole, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                role === value
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Create a username"
                autoComplete="username"
                minLength={3}
                required
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              College ID
            </label>
            <div className="relative">
              <Building2
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="Enter your college ID"
                required
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Phone (optional)
            </label>
            <div className="relative">
              <Phone
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                autoComplete="tel"
                disabled={loading}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={loading}
                className={`${inputClass} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Minimum 8 characters. The first character must be uppercase.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                disabled={loading}
                className={`${inputClass} pr-14`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                disabled={loading}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {confirmPassword && (
              <p
                className={`text-xs mt-2 ${
                  password === confirmPassword
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {password === confirmPassword
                  ? 'Passwords match.'
                  : 'Passwords do not match.'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={20} />
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-slate-500">
            Already registered?{' '}
          </span>
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};