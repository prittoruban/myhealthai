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
    <div className="min-h-screen bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#f70776] via-[#c3195d] to-[#680747] py-3 animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl animate-bounce">🎯</span>
              <span className="font-bold drop-shadow-lg">Prototype Demo - Perfect for Evaluation!</span>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="px-6 py-2.5 glass-strong text-white rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-white/30"
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-[#c3195d] to-[#680747] rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-[#680747] to-[#f70776] rounded-full mix-blend-normal filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-pulse border border-[#f70776]/30 shadow-lg shadow-[#f70776]/20">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-bold text-[#f70776]">Meet MyHealthAI</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Health Made Easy <br />
                <span className="bg-gradient-to-r from-[#f70776] via-[#c3195d] to-[#680747] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  With AI
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                Track and reduce your edible oil consumption with smart AI insights. 
                <span className="text-[#f70776] font-semibold"> Personalized for Indian cooking habits.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-2xl hover:shadow-2xl hover:shadow-[#f70776]/50 transform hover:-translate-y-1 transition-all duration-300 text-lg font-bold relative overflow-hidden"
                >
                  <span className="relative z-10">Start Tracking Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c3195d] to-[#f70776] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <button
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 glass-strong text-gray-900 dark:text-white rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg font-bold backdrop-blur-xl"
                >
                  See Features
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 glass-strong text-gray-900 dark:text-white rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg font-bold backdrop-blur-xl"
                >
                  How It Works
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#f70776] text-xl">✓</span>
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f70776] text-xl">✓</span>
                  <span>Indian Recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f70776] text-xl">✓</span>
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
            
            {/* Right Image/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 glass-strong rounded-3xl shadow-2xl shadow-[#f70776]/20 p-8 border border-white/10">
                <div className="bg-gradient-to-br from-[#f70776] to-[#c3195d] text-white rounded-2xl p-6 mb-6 shadow-lg shadow-[#f70776]/50">
                  <div className="text-sm font-semibold mb-2 opacity-90">Today&apos;s Progress</div>
                  <div className="text-4xl font-bold">18/30 ml</div>
                  <div className="text-sm opacity-90 mt-1">60% of daily goal</div>
                </div>
                <div className="space-y-3">
                  <div className="glass rounded-xl p-4 border border-white/10 hover:border-[#f70776]/30 transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Breakfast - Dosa</div>
                        <div className="text-sm text-gray-400">Sunflower Oil</div>
                      </div>
                      <div className="text-[#f70776] font-bold">5ml</div>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4 border border-white/10 hover:border-[#f70776]/30 transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-white">Lunch - Dal Tadka</div>
                        <div className="text-sm text-gray-400">Mustard Oil</div>
                      </div>
                      <div className="text-[#f70776] font-bold">10ml</div>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4 border-2 border-[#f70776]/50 bg-gradient-to-r from-[#f70776]/10 to-[#c3195d]/10 hover:shadow-lg hover:shadow-[#f70776]/20 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍳</span>
                      <div>
                        <div className="font-semibold text-white">Try RasoiAI</div>
                        <div className="text-sm text-gray-300">Get low-oil recipes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f70776] rounded-full opacity-30 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#c3195d] rounded-full opacity-30 blur-3xl animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block glass px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-[#f70776]/30">
              <span className="text-[#f70776]">FEATURES</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Track Oil
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed specifically for Indian cooking habits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl border border-white/10 hover:border-[#f70776]/30 hover:shadow-2xl hover:shadow-[#f70776]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-[#f70776]/50">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Tracking</h3>
              <p className="text-gray-300 mb-4">
                Log your meals and monitor oil consumption with visual progress tracking and daily goals
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Real-time progress updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Circular progress indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Daily consumption history
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl border border-white/10 hover:border-[#c3195d]/30 hover:shadow-2xl hover:shadow-[#c3195d]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-[#c3195d]/50">
                🍳
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">RasoiAI Recipes</h3>
              <p className="text-gray-300 mb-4">
                Discover healthy, low-oil Indian recipes with detailed cooking methods and health tips
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#c3195d]">→</span>
                  10+ popular Indian dishes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#c3195d]">→</span>
                  Oil-reduction techniques
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#c3195d]">→</span>
                  Nutritionist-approved methods
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl border border-white/10 hover:border-[#680747]/30 hover:shadow-2xl hover:shadow-[#680747]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#680747] to-[#f70776] rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-[#680747]/50">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Personalized Goals</h3>
              <p className="text-gray-300 mb-4">
                Set custom daily oil goals and earn points for consistent tracking to stay motivated
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Customizable daily targets
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Points & achievements
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f70776]">→</span>
                  Progress analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-[#680747] via-[#141010] to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#f70776] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#c3195d] rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block glass px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-[#f70776]/30">
              <span className="text-[#f70776]">HOW IT WORKS</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Tracking in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-2xl shadow-[#f70776]/50 animate-pulse">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
              <p className="text-gray-300">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-2xl shadow-[#c3195d]/50 animate-pulse animation-delay-2000">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Log Your Meals</h3>
              <p className="text-gray-300">
                Add meal name, oil type, and quantity after cooking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#680747] to-[#f70776] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-2xl shadow-[#680747]/50 animate-pulse animation-delay-4000">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
              <p className="text-gray-300">
                View insights, discover recipes, and reduce oil intake.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-xl hover:shadow-2xl hover:shadow-[#f70776]/50 transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-[#f70776]/30 transition-all duration-300 animate-scale-in">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text mb-2">30ml</div>
              <div className="text-gray-300 font-medium">Recommended Daily Limit</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-[#c3195d]/30 transition-all duration-300 animate-scale-in animation-delay-100">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#c3195d] to-[#680747] bg-clip-text mb-2">10+</div>
              <div className="text-gray-300 font-medium">Low-Oil Recipes</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-[#680747]/30 transition-all duration-300 animate-scale-in animation-delay-200">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#680747] to-[#f70776] bg-clip-text mb-2">100%</div>
              <div className="text-gray-300 font-medium">Free to Use</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 hover:border-[#f70776]/30 transition-all duration-300 animate-scale-in animation-delay-300">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text mb-2">24/7</div>
              <div className="text-gray-300 font-medium">Access Anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#141010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text mb-4">
              What Early Users Say
            </h2>
            <p className="text-xl text-gray-400">Join the health revolution</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:border-[#f70776]/30 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  P
                </div>
                <div>
                  <div className="font-semibold text-white">Priya Sharma</div>
                  <div className="text-sm text-gray-400">Mumbai</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic">
                &ldquo;Finally! An app that understands Indian cooking. Lost 5kg in 3 months just by tracking oil consumption!&rdquo;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:border-[#f70776]/30 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div>
                  <div className="font-semibold text-white">Rahul Mehta</div>
                  <div className="text-sm text-gray-400">Delhi</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic">
                &ldquo;RasoiAI is a game-changer! Love discovering healthy alternatives to my favorite dishes.&rdquo;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10 hover:border-[#f70776]/30 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#680747] to-[#f70776] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <div className="font-semibold text-white">Sneha Patel</div>
                  <div className="text-sm text-gray-400">Bangalore</div>
                </div>
              </div>
              <div className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 italic">
                &ldquo;Simple, intuitive, and effective. The progress tracking keeps me motivated every day!&rdquo;
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <div className="glass-strong inline-block px-8 py-4 rounded-full border border-[#f70776]/30">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-full border-2 border-[#141010] flex items-center justify-center text-white text-xs font-bold">P</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-full border-2 border-[#141010] flex items-center justify-center text-white text-xs font-bold">R</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#680747] to-[#f70776] rounded-full border-2 border-[#141010] flex items-center justify-center text-white text-xs font-bold">S</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-full border-2 border-[#141010] flex items-center justify-center text-white text-xs font-bold">+</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#f70776] to-[#c3195d] bg-clip-text">500+</div>
                  <div className="text-sm text-gray-400">Early Adopters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#f70776] to-[#c3195d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians who are taking control of their oil consumption with MyHealthAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-[#f70776] rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-lg font-semibold"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-[#f70776] transition-all duration-200 text-lg font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

