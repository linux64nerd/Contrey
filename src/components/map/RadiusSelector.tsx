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
    { id: 'hotel', label: '🏨 Hotels' },
    { id: 'restaurant', label: '🍽️ Dining & Cafes' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'attraction', label: '🏖️ Tourist Attractions' },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Radius Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Search Radius:</span>
          </span>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onSelectRadius(1)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                radiusKm === 1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 km Radius
            </button>
            <button
              onClick={() => onSelectRadius(2)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                radiusKm === 2
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2 km Radius
            </button>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="best-value">✨ Best Value (Rating + Price)</option>
            <option value="rating">★ Highest Rating</option>
            <option value="price">💰 Lowest Estimated Price</option>
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
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-[11px] text-slate-400 ml-auto whitespace-nowrap">
          {totalFound} spots found
        </span>
      </div>
    </div>
  );
};
