import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          MyHealthAI
        </h1>
        <p className="text-2xl text-gray-600 mb-4">
          Track and Reduce Your Edible Oil Consumption
        </p>
        <p className="text-lg text-gray-500 mb-12">
          A culturally aware platform designed for Indian users to monitor daily oil intake, 
          discover healthy recipes, and build better eating habits.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg text-lg font-medium"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition shadow-lg text-lg font-medium"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold text-gray-800 mb-2">Track Daily Usage</h3>
            <p className="text-sm text-gray-600">
              Log your meals and monitor oil consumption with visual progress tracking
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🍳</div>
            <h3 className="font-bold text-gray-800 mb-2">RasoiAI Recipes</h3>
            <p className="text-sm text-gray-600">
              Discover healthy, low-oil Indian recipes tailored to your needs
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Earn Points</h3>
            <p className="text-sm text-gray-600">
              Stay motivated by earning points for consistent tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

