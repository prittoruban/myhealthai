'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      // First, seed demo data (creates account if needed)
      await fetch('/api/seed-demo', {
        method: 'POST',
      });

      // Then sign in
      const result = await signIn('credentials', {
        email: 'demo@myhealthai.com',
        password: 'demo123',
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl animate-bounce">🎯</span>
              <span className="font-semibold">Prototype Demo - Perfect for Evaluation!</span>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="px-6 py-2 bg-white text-orange-600 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {demoLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Try Demo Now - One Click!
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6 animate-pulse">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-semibold text-green-800">Meet MyHealthAI</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Health Made Easy <br />
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  With AI
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Track and reduce your edible oil consumption with smart AI insights. 
                Personalized for Indian cooking habits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold"
                >
                  Start Tracking Free
                </Link>
                <button
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      const offset = 80; // Adjust for navbar height
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all duration-200 text-lg font-semibold"
                >
                  See Features
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      const offset = 80; // Adjust for navbar height
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 text-lg font-semibold"
                >
                  How It Works
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Indian Recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
            
            {/* Right Image/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-8">
                <div className="bg-green-600 text-white rounded-2xl p-6 mb-6">
                  <div className="text-sm font-semibold mb-2">Today&apos;s Progress</div>
                  <div className="text-4xl font-bold">18/30 ml</div>
                  <div className="text-sm opacity-90 mt-1">60% of daily goal</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">Breakfast - Dosa</div>
                        <div className="text-sm text-gray-500">Sunflower Oil</div>
                      </div>
                      <div className="text-green-600 font-bold">5ml</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">Lunch - Dal Tadka</div>
                        <div className="text-sm text-gray-500">Mustard Oil</div>
                      </div>
                      <div className="text-green-600 font-bold">10ml</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍳</span>
                      <div>
                        <div className="font-semibold text-gray-800">Try RasoiAI</div>
                        <div className="text-sm text-gray-600">Get low-oil recipes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Track Oil
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for Indian cooking habits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                📊
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Smart Tracking</h3>
              <p className="text-gray-600 mb-4">
                Log your meals and monitor oil consumption with visual progress tracking and daily goals
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Real-time progress updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Circular progress indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Daily consumption history
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                🍳
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">RasoiAI Recipes</h3>
              <p className="text-gray-600 mb-4">
                Discover healthy, low-oil Indian recipes with detailed cooking methods and health tips
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">→</span>
                  10+ popular Indian dishes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">→</span>
                  Oil-reduction techniques
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">→</span>
                  Nutritionist-approved methods
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Personalized Goals</h3>
              <p className="text-gray-600 mb-4">
                Set custom daily oil goals and earn points for consistent tracking to stay motivated
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  Customizable daily targets
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  Points & achievements
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  Progress analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Tracking in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Log Your Meals</h3>
              <p className="text-gray-600">
                Add meal name, oil type, and quantity after cooking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                View insights, discover recipes, and reduce oil intake.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">30ml</div>
              <div className="text-gray-600">Recommended Daily Limit</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10+</div>
              <div className="text-gray-600">Low-Oil Recipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Access Anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians who are taking control of their oil consumption with MyHealthAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-green-600 rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-green-600 transition-all duration-200 text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

