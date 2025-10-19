'use client';

import { useState } from 'react';
import { useToast } from '@/components/ToastProvider';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogMealModal({
  isOpen,
  onClose,
  onSuccess,
}: LogMealModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    mealName: '',
    oilType: '',
    quantityInMl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const oilTypes = [
    'Sunflower Oil',
    'Coconut Oil',
    'Mustard Oil',
    'Olive Oil',
    'Groundnut Oil',
    'Ghee',
    'Rice Bran Oil',
    'Sesame Oil',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: formData.mealName,
          oilType: formData.oilType,
          quantityInMl: parseFloat(formData.quantityInMl),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to log meal');
        showToast(data.error || 'Failed to log meal', 'error');
      } else {
        setFormData({ mealName: '', oilType: '', quantityInMl: '' });
        showToast('Meal logged successfully! +1 point', 'success');
        onSuccess();
        onClose();
      }
    } catch {
      setError('An unexpected error occurred');
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl shadow-green-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Log Meal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="glass-strong border border-red-400/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meal Name
            </label>
            <input
              type="text"
              required
              value={formData.mealName}
              onChange={(e) =>
                setFormData({ ...formData, mealName: e.target.value })
              }
              className="w-full px-4 py-2 glass-strong border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-500"
              placeholder="e.g., Lunch - Dal Tadka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Oil Type
            </label>
            <select
              required
              value={formData.oilType}
              onChange={(e) =>
                setFormData({ ...formData, oilType: e.target.value })
              }
              className="w-full px-4 py-2 glass-strong border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white"
            >
              <option value="" className="bg-gray-800">Select oil type</option>
              {oilTypes.map((oil) => (
                <option key={oil} value={oil} className="bg-gray-800">
                  {oil}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity (ml)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.quantityInMl}
              onChange={(e) =>
                setFormData({ ...formData, quantityInMl: e.target.value })
              }
              className="w-full px-4 py-2 glass-strong border border-white/20 rounded-lg focus:ring-2 focus:ring-[#f70776] focus:border-[#f70776] text-white placeholder-gray-500"
              placeholder="e.g., 15"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 glass-strong border border-white/20 text-gray-300 rounded-lg hover:border-white/40 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging...' : 'Log Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
