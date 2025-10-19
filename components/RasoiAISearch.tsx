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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setRecipe(null);

    try {
      const response = await fetch(
        `/api/rasoiai/recipe?dishName=${encodeURIComponent(searchQuery)}`
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl">🍳</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">RasoiAI</h2>
          <p className="text-sm text-gray-500">
            Find healthy, low-oil Indian recipes
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a dish (e.g., Dosa, Dal, Curry)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {recipe && (
        <div className="space-y-4 animate-fade-in">
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {recipe.dishName}
            </h3>

            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Oil Used:
                </span>
                <span className="text-sm font-bold text-green-700">
                  {recipe.oilUsed}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <span className="text-sm font-bold text-green-700">
                  {recipe.quantityInMl} ml
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Ingredients:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Cooking Method:
              </h4>
              <p className="text-sm text-gray-600">{recipe.cookingMethod}</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Health Tips:
              </h4>
              <p className="text-sm text-blue-700">{recipe.healthTips}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
