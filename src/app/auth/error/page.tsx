'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
    Configuration: {
      title: 'Configuration Error',
      description: 'There is a problem with the server configuration.',
      solution: 'Please contact the administrator. The NEXTAUTH_URL or NEXTAUTH_SECRET might not be properly configured.',
    },
    AccessDenied: {
      title: 'Access Denied',
      description: 'You do not have permission to sign in.',
      solution: 'Please check your credentials and try again.',
    },
    Verification: {
      title: 'Verification Error',
      description: 'The verification token has expired or has already been used.',
      solution: 'Please try signing in again.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An error occurred during authentication.',
      solution: 'Please try again or contact support if the problem persists.',
    },
  };

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
      <div className="glass-strong p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
            <span className="text-white font-bold text-4xl">⚠️</span>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-center text-white mb-3">
          {errorInfo.title}
        </h1>

        {/* Error Code */}
        {error && (
          <div className="text-center mb-4">
            <span className="text-xs px-3 py-1 bg-red-500/20 text-red-300 rounded-full">
              Error Code: {error}
            </span>
          </div>
        )}

        {/* Error Description */}
        <p className="text-gray-300 text-center mb-4">
          {errorInfo.description}
        </p>

        {/* Solution */}
        <div className="glass rounded-lg p-4 border border-red-500/30 bg-red-500/10 mb-6">
          <p className="text-sm text-gray-300">
            <span className="font-bold text-red-300">Solution:</span> {errorInfo.solution}
          </p>
        </div>

        {/* Environment Check for Admins */}
        {error === 'Configuration' && (
          <div className="glass rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/10 mb-6">
            <p className="text-xs text-gray-400 mb-2">
              <span className="font-bold text-yellow-300">For Administrators:</span>
            </p>
            <ul className="text-xs text-gray-400 space-y-1 ml-4 list-disc">
              <li>Verify NEXTAUTH_URL is set to production URL</li>
              <li>Verify NEXTAUTH_SECRET is at least 32 characters</li>
              <li>Check MongoDB connection string is correct</li>
              <li>Ensure all environment variables are set in deployment platform</li>
            </ul>
            <div className="mt-3">
              <Link 
                href="/api/health" 
                className="text-xs text-yellow-400 hover:text-yellow-300 underline"
              >
                Check system health →
              </Link>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 font-semibold"
          >
            Try Again
          </Link>
          
          <Link
            href="/"
            className="block w-full text-center px-6 py-3 glass border border-white/20 text-gray-300 rounded-lg hover:border-[#f70776]/30 transition-all font-medium"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Need help? Contact support or try the{' '}
          <Link href="/" className="text-[#f70776] hover:text-[#c3195d] underline">
            Quick Demo
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f70776] mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
