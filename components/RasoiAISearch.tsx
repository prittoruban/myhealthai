'use client';

import { useState } from 'react';

interface Recipe {
  dishName: string;
  ingredients: string[];
  oilUsed: string;
  quantityInMl: number;
  cookingMethod: string;
  healthTips: string;
}

export default function RasoiAISearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');

  // Popular demo dishes with emojis
  const demoSuggestions = [
    { name: 'Dosa', emoji: '🫓' },
    { name: 'Poha', emoji: '🍚' },
    { name: 'Paratha', emoji: '🥙' },
    { name: 'Dal Tadka', emoji: '🍲' },
    { name: 'Paneer Butter Masala', emoji: '🧈' },
    { name: 'Biryani', emoji: '🍛' },
  ];

  const handleDemoClick = (dishName: string) => {
    setSearchQuery(dishName);
    // Trigger search
    handleSearchWithQuery(dishName);
  };

  const handleSearchWithQuery = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setRecipe(null);

    try {
      const response = await fetch(
        `/api/rasoiai/recipe?dishName=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Recipe not found');
      } else {
        setRecipe(data.recipe);
      }
    } catch {
      setError('Failed to fetch recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchWithQuery(searchQuery);
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl shadow-[#c3195d]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-full flex items-center justify-center shadow-lg shadow-[#c3195d]/50">
          <span className="text-white text-xl">🍳</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">RasoiAI</h2>
          <p className="text-sm text-gray-400">
            Find healthy, low-oil Indian recipes
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a dish (e.g., Dosa, Dal, Curry)"
            className="flex-1 px-4 py-2 glass-strong border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Demo Suggestions */}
      {!recipe && !error && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3 font-medium">✨ Try these popular dishes:</p>
          <div className="grid grid-cols-2 gap-2">
            {demoSuggestions.map((dish) => (
              <button
                key={dish.name}
                onClick={() => handleDemoClick(dish.name)}
                disabled={loading}
                className="glass-strong border border-white/10 hover:border-[#f70776]/50 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{dish.emoji}</span>
                <span>{dish.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="glass-strong border border-yellow-400/50 text-yellow-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {recipe && (
        <div className="space-y-4 animate-fade-in">
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-lg font-bold text-white mb-2">
              {recipe.dishName}
            </h3>

            <div className="glass-strong border border-[#f70776]/30 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">
                  Oil Used:
                </span>
                <span className="text-sm font-bold text-[#f70776]">
                  {recipe.oilUsed}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-300">
                  Quantity:
                </span>
                <span className="text-sm font-bold text-[#f70776]">
                  {recipe.quantityInMl} ml
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-300 mb-2">
                Ingredients:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-300 mb-2">
                Cooking Method:
              </h4>
              <p className="text-sm text-gray-400">{recipe.cookingMethod}</p>
            </div>

            <div className="glass-strong border border-[#c3195d]/30 p-3 rounded-lg">
              <h4 className="font-semibold text-[#c3195d] mb-2">
                💡 Health Tips:
              </h4>
              <p className="text-sm text-gray-300">{recipe.healthTips}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
