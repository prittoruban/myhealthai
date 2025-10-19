'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        // Redirect to login page after successful registration
        router.push('/login?registered=true');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
      <div className="glass-strong p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f70776]/30 animate-glow-pulse">
              <span className="text-white font-bold text-3xl">M</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text mb-2">
            Join MyHealthAI
          </h1>
          <p className="text-gray-300">
            Start tracking your oil consumption today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass border border-red-500/50 bg-red-500/10 text-red-300 px-4 py-3 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-400 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-400 transition-all"
              placeholder="••••••••"
            />
            <p className="mt-1 text-sm text-gray-400">
              At least 6 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white py-3 px-4 rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Creating account...
              </span>
            ) : (
              '🚀 Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#f70776] hover:text-[#c3195d] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-center text-gray-500 text-sm mt-3">
            or{' '}
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
