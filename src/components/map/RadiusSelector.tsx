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
    { id: 'restaurant', label: 'Dining & Cafes' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'attraction', label: 'Attractions' },
  ];

  return (
    <div className="bg-[#ffffff] rounded-[12px] p-4 sm:p-5 border border-[rgba(0,0,0,0.08)] space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Radius Filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#000000] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#0075de]" />
            <span>Search Radius:</span>
          </span>
          <div className="flex p-0.5 bg-[#f6f5f4] rounded-[6px] border border-[rgba(0,0,0,0.06)]">
            <button
              onClick={() => onSelectRadius(1)}
              className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
                radiusKm === 1
                  ? 'bg-[#ffffff] text-[#0075de] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              1 km
            </button>
            <button
              onClick={() => onSelectRadius(2)}
              className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all ${
                radiusKm === 2
                  ? 'bg-[#ffffff] text-[#0075de] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              2 km
            </button>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#757575]" />
          <span className="text-xs font-medium text-[#757575]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-[6px] border border-[rgba(0,0,0,0.12)] text-xs font-medium text-[#000000] bg-[#ffffff] focus:outline-none focus:border-[#0075de] cursor-pointer"
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
        <Filter className="w-3.5 h-3.5 text-[#757575] shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#0075de] text-[#ffffff] border-[#0075de]'
                : 'bg-[#f6f5f4] hover:bg-[#ffffff] text-[#615d59] border-[rgba(0,0,0,0.08)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-xs text-[#757575] ml-auto whitespace-nowrap font-medium">
          {totalFound} spots found
        </span>
      </div>
    </div>
  );
};
