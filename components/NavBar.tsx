'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleQuickDemo = async () => {
    setDemoLoading(true);
    setMobileMenuOpen(false);
    try {
      await signIn('credentials', {
        email: 'demo@myhealthai.com',
        password: 'demo123',
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      console.error('Demo login failed:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-lg flex items-center justify-center shadow-lg shadow-[#f70776]/30 group-hover:shadow-[#f70776]/50 transition-all">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text text-transparent">
              MyHealthAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className={`text-sm font-semibold transition-all ${
                isActive('/#features')
                  ? 'text-[#f70776]'
                  : 'text-gray-300 hover:text-[#f70776]'
              }`}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className={`text-sm font-semibold transition-all ${
                isActive('/#how-it-works')
                  ? 'text-[#f70776]'
                  : 'text-gray-300 hover:text-[#f70776]'
              }`}
            >
              How It Works
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className={`text-sm font-semibold transition-all ${
                  isActive('/dashboard')
                    ? 'text-[#f70776]'
                    : 'text-gray-300 hover:text-[#f70776]'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <div className="text-sm text-gray-300 font-medium">
                  {session.user?.email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleQuickDemo}
                  disabled={demoLoading}
                  className="relative px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-lg hover:shadow-lg hover:shadow-[#f70776]/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10">
                    {demoLoading ? '⏳ Loading...' : '✨ Quick Demo'}
                  </span>
                  {!demoLoading && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>
                  )}
                </button>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-[#f70776] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-lg hover:shadow-lg hover:shadow-[#f70776]/50 hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-strong border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/#features"
              className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#680747]/30 hover:text-[#f70776] rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#680747]/30 hover:text-[#f70776] rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#680747]/30 hover:text-[#f70776] rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="border-t border-white/10 pt-3">
              {session ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-400">
                    {session.user?.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleQuickDemo}
                    disabled={demoLoading}
                    className="block w-full px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-lg text-center mb-2 hover:shadow-lg hover:shadow-[#f70776]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {demoLoading ? '⏳ Loading Demo...' : '✨ Quick Demo'}
                  </button>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#680747]/30 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-lg text-center mt-2 hover:shadow-lg hover:shadow-[#f70776]/50 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
