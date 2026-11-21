import React from 'react';
import { Compass, Filter, ArrowUpDown } from 'lucide-react';

interface RadiusSelectorProps {
  radiusKm: number;
  onSelectRadius: (radius: number) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: 'best-value' | 'rating' | 'price' | 'distance';
  onSelectSortBy: (sort: 'best-value' | 'rating' | 'price' | 'distance') => void;
  totalFound: number;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  radiusKm,
  onSelectRadius,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  totalFound,
}) => {
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'restaurant', label: 'Dining & Cafés' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'attraction', label: 'Attractions' },
  ];

  return (
    <div className="contrey-card p-5 space-y-4 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Radius Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Search Radar:</span>
          </span>
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => onSelectRadius(1)}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                radiusKm === 1
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1 km Radius
            </button>
            <button
              onClick={() => onSelectRadius(2)}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                radiusKm === 2
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2 km Radius
            </button>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as 'best-value' | 'rating' | 'price' | 'distance')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="best-value">✨ Best Value</option>
            <option value="rating">★ Highest Rating</option>
            <option value="price">💰 Lowest Price</option>
            <option value="distance">📍 Nearest Distance</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-auto whitespace-nowrap">
          {totalFound} spots found
        </span>
      </div>
    </div>
  );
};
