'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recipe {
  dishName: string;
  ingredients: string[];
  oilUsed: string;
  quantityInMl: number;
  cookingMethod: string;
  healthTips: string;
}

interface OilComparison {
  traditional: number;
  lowOil: number;
  savings: number;
  savingsPercent: number;
}

export default function RasoiAISearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'recipe' | 'tips' | 'alternatives'>('recipe');

  // Popular demo dishes with emojis and categories
  const demoSuggestions = [
    { name: 'Dosa', emoji: '🫓', category: 'Breakfast', time: '20 min' },
    { name: 'Poha', emoji: '🍚', category: 'Breakfast', time: '15 min' },
    { name: 'Idli', emoji: '⚪', category: 'Breakfast', time: '25 min' },
    { name: 'Dal Tadka', emoji: '🍲', category: 'Main Course', time: '30 min' },
    { name: 'Palak Paneer', emoji: '🥬', category: 'Main Course', time: '35 min' },
    { name: 'Khichdi', emoji: '🍛', category: 'Comfort Food', time: '25 min' },
  ];

  // Calculate oil comparison
  const getOilComparison = (lowOilAmount: number): OilComparison => {
    // Traditional cooking typically uses 3-4x more oil
    const traditional = lowOilAmount * 3.5;
    const savings = traditional - lowOilAmount;
    const savingsPercent = ((savings / traditional) * 100);
    
    return {
      traditional,
      lowOil: lowOilAmount,
      savings,
      savingsPercent
    };
  };

  // Calculate nutritional benefits
  const getNutritionalSavings = (oilSavedMl: number) => {
    // 1ml oil ≈ 9 calories
    const caloriesSaved = Math.round(oilSavedMl * 9);
    // 1 gram fat = 9 calories, oil density ≈ 0.92g/ml
    const fatSavedGrams = Math.round(oilSavedMl * 0.92);
    
    return { caloriesSaved, fatSavedGrams };
  };

  // Get alternative cooking methods
  const getAlternativeMethods = (dishName: string) => {
    const alternatives: Record<string, string[]> = {
      'Dosa': [
        '🍳 Non-stick pan (recommended) - Uses 60% less oil',
        '⚡ Electric dosa maker - Even heat distribution',
        '🔥 Cast iron tawa (well-seasoned) - Needs minimal greasing'
      ],
      'Palak Paneer': [
        '🌬️ Air-fry paneer cubes instead of shallow frying',
        '🔥 Grill paneer for a smoky flavor with zero oil',
        '💨 Steam spinach to retain nutrients and reduce oil'
      ],
      'Chole': [
        '🍲 Instant Pot - Faster cooking, retains moisture',
        '🥘 Slow cooker - Intense flavors with minimal oil',
        '🔥 Dry roast spices before adding for depth'
      ],
      'Poha': [
        '🌬️ Steam poha instead of rinsing for fluffier texture',
        '🥜 Dry roast peanuts separately for crunch',
        '🔥 Use a wide pan for even cooking with less oil'
      ]
    };

    return alternatives[dishName] || [
      '🌬️ Air fryer - For crispy results with 80% less oil',
      '💨 Steaming - Preserve nutrients, zero oil required',
      '🔥 Grilling - Add flavor without extra fat',
      '🍲 Pressure cooking - Fast, moist, minimal oil needed'
    ];
  };

  const handleDemoClick = (dishName: string) => {
    setSearchQuery(dishName);
    handleSearchWithQuery(dishName);
  };

  const handleSearchWithQuery = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setRecipe(null);
    setShowComparison(false);

    try {
      const response = await fetch(
        `/api/rasoiai/recipe?dishName=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Recipe not found');
      } else {
        setRecipe(data.recipe);
        setShowComparison(true);
        setActiveTab('recipe');
      }
    } catch {
      setError('Failed to fetch recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchWithQuery(searchQuery);
  };

  // Auto-show comparison after 2 seconds
  useEffect(() => {
    if (recipe && !showComparison) {
      const timer = setTimeout(() => setShowComparison(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [recipe, showComparison]);

  const oilComparison = recipe ? getOilComparison(recipe.quantityInMl) : null;
  const nutritionalSavings = oilComparison ? getNutritionalSavings(oilComparison.savings) : null;
  const alternativeMethods = recipe ? getAlternativeMethods(recipe.dishName) : [];

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl shadow-[#c3195d]/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-[#f70776] to-[#680747] rounded-full flex items-center justify-center shadow-lg shadow-[#f70776]/50"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(247, 7, 118, 0.5)',
              '0 0 40px rgba(247, 7, 118, 0.8)',
              '0 0 20px rgba(247, 7, 118, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white text-2xl">🤖</span>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            RasoiAI
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-full">
              BETA
            </span>
          </h2>
          <p className="text-sm text-gray-400">
            AI-Powered Low-Oil Indian Recipe Assistant
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search for any Indian dish..."
              className="w-full px-4 py-3 pl-10 glass-strong border border-white/20 rounded-xl focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-400 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-xl hover:shadow-xl hover:shadow-[#f70776]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⚙️
                </motion.span>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </motion.button>
        </div>
      </form>

      {/* Demo Suggestions */}
      <AnimatePresence>
        {!recipe && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-300">✨ Popular Recipes</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#f70776]/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {demoSuggestions.map((dish, index) => (
                <motion.button
                  key={dish.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleDemoClick(dish.name)}
                  disabled={loading}
                  className="group glass-strong border border-white/10 hover:border-[#f70776]/50 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {dish.emoji}
                    </span>
                    <span className="font-semibold">{dish.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-white/5 rounded-full">
                      {dish.category}
                    </span>
                    <span>⏱️ {dish.time}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-strong border border-yellow-400/50 text-yellow-300 px-4 py-3 rounded-xl flex items-start gap-3"
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold">Recipe Not Found</p>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Display */}
      <AnimatePresence>
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Recipe Header */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {recipe.dishName}
                    <span className="text-lg">
                      {demoSuggestions.find(d => d.name === recipe.dishName)?.emoji || '🍽️'}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    {demoSuggestions.find(d => d.name === recipe.dishName)?.category || 'Traditional Indian Dish'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-3 py-2 glass-strong border border-[#f70776]/30 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                  title="Save to favorites"
                >
                  ❤️ Save
                </motion.button>
              </div>

              {/* Oil Comparison Highlight */}
              {oilComparison && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass-strong border-2 border-[#f70776]/50 p-4 rounded-xl mb-4 bg-gradient-to-r from-[#f70776]/10 to-[#c3195d]/10"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {oilComparison.lowOil}<span className="text-lg">ml</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Low-Oil Method</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#f70776]">
                        {Math.round(oilComparison.savingsPercent)}<span className="text-lg">%</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Oil Saved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-500 line-through">
                        {oilComparison.traditional}<span className="text-lg">ml</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Traditional</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Nutritional Savings */}
              {nutritionalSavings && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-strong border border-green-400/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          -{nutritionalSavings.caloriesSaved}
                        </div>
                        <div className="text-xs text-gray-400">Calories Saved</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-strong border border-blue-400/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚖️</span>
                      <div>
                        <div className="text-lg font-bold text-blue-400">
                          -{nutritionalSavings.fatSavedGrams}g
                        </div>
                        <div className="text-xs text-gray-400">Fat Reduced</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b border-white/10">
                {(['recipe', 'tips', 'alternatives'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium transition-all relative ${
                      activeTab === tab
                        ? 'text-[#f70776]'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'recipe' && '📖 Recipe'}
                    {tab === 'tips' && '💡 Health Tips'}
                    {tab === 'alternatives' && '🔄 Alternatives'}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#f70776] to-[#c3195d]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'recipe' && (
                  <motion.div
                    key="recipe"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Oil Info */}
                    <div className="glass-strong border border-[#f70776]/30 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          🛢️ Oil Used:
                        </span>
                        <span className="text-sm font-bold text-[#f70776]">
                          {recipe.oilUsed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">
                          📊 Quantity:
                        </span>
                        <span className="text-sm font-bold text-[#f70776]">
                          {recipe.quantityInMl} ml
                        </span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <span>🥗</span> Ingredients
                      </h4>
                      <div className="glass-strong border border-white/10 p-4 rounded-xl">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {recipe.ingredients.map((ingredient: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-2 text-sm text-gray-400"
                            >
                              <span className="text-[#f70776]">✓</span>
                              {ingredient}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cooking Method */}
                    <div>
                      <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <span>👨‍🍳</span> Cooking Method
                      </h4>
                      <div className="glass-strong border border-white/10 p-4 rounded-xl">
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {recipe.cookingMethod}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tips' && (
                  <motion.div
                    key="tips"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="glass-strong border-2 border-[#c3195d]/50 p-4 rounded-xl bg-gradient-to-br from-[#c3195d]/10 to-[#680747]/10">
                      <h4 className="font-semibold text-[#f70776] mb-3 flex items-center gap-2 text-lg">
                        <span>💡</span> Health & Nutrition Tips
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed mb-4">
                        {recipe.healthTips}
                      </p>
                      
                      {/* Additional Tips */}
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-green-400">✓</span>
                          <p>Using less oil helps reduce calorie intake and supports heart health</p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-green-400">✓</span>
                          <p>Low-oil cooking preserves the natural flavors of ingredients</p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-green-400">✓</span>
                          <p>Pair with vegetables for a complete, balanced meal</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'alternatives' && (
                  <motion.div
                    key="alternatives"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <span>🔄</span> Alternative Cooking Methods
                      </h4>
                      {alternativeMethods.map((method, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass-strong border border-white/10 p-3 rounded-lg hover:border-[#f70776]/30 transition-all"
                        >
                          <p className="text-sm text-gray-300">{method}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
