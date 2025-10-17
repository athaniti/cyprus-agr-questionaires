import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onLogin?: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const testUsers = [
    { email: 'admin@agriculture.gov.cy', role: 'Administrator' },
    { email: 'user@agriculture.gov.cy', role: 'Analyst' },
    { email: 'farmer@email.com', role: 'Farmer' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      const success = await login(email);
      if (success && onLogin) {
        onLogin();
      } else if (!success) {
        setError('Login failed. Please check your email and try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleTestUserLogin = async (testEmail: string) => {
    setEmail(testEmail);
    setError('');
    
    try {
      const success = await login(testEmail);
      if (success && onLogin) {
        onLogin();
      } else if (!success) {
        setError('Login failed for test user.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cyprus Agriculture Questionnaires
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Demo Users</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {testUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleTestUserLogin(user.email)}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{user.email}</span>
                  <span className="ml-2 text-gray-400">({user.role})</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>For demo purposes, any password will work</p>
          <p>Click on demo users above for quick login</p>
        </div>
      </div>
    </div>
  );
}