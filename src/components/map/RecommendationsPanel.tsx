import React from 'react';
import { PlaceRecommendation } from '../../types/map';
import { useCurrency } from '../../context/CurrencyContext';
import { Star, MapPin, Sparkles, Plus } from 'lucide-react';

interface RecommendationsPanelProps {
  places: PlaceRecommendation[];
  selectedPlace: PlaceRecommendation | null;
  onSelectPlace: (place: PlaceRecommendation) => void;
  onQuickAddExpense?: (place: PlaceRecommendation) => void;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  onQuickAddExpense,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hotel':
        return 'Hotel / Stay';
      case 'restaurant':
        return 'Dining / Café';
      case 'shopping':
        return 'Shopping';
      case 'attraction':
      default:
        return 'Attraction';
    }
  };

  if (places.length === 0) {
    return (
      <div className="contrey-card p-8 text-center text-slate-500 dark:text-slate-400 space-y-2 dark:bg-slate-900 dark:border-slate-800">
        <MapPin className="w-8 h-8 mx-auto text-slate-400" />
        <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">
          No Places Found in Radius
        </p>
        <p className="text-xs">Try switching to a 2 km search radius or clearing category filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
          Curated Travel Spots
        </h3>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {places.length} SPOTS
        </span>
      </div>

      <div className="space-y-3">
        {places.map((place, idx) => {
          const isSelected = selectedPlace?.id === place.id;
          const convertedPrice = convertAmount(place.estimatedPrice, 'EUR', currentCurrency);
          const staggerClass = `stagger-${(idx % 6) + 1}`;

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover-lift-sm animate-fade-in-up ${staggerClass} ${
                isSelected
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 border-slate-200/90 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Header: Name and Best Value Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1">
                      {getCategoryLabel(place.category)}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {place.name}
                    </h4>
                  </div>

                  {place.isBestValue && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Best Value
                    </span>
                  )}
                </div>

                {/* Rating & Distance */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{place.rating.toFixed(1)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{place.distanceKm} km away</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                  {place.reviewSnippet}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Estimated Cost
                  </span>
                  <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    ~{format(convertedPrice)}
                  </span>
                </div>

                {onQuickAddExpense && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddExpense(place);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors border border-indigo-200 dark:border-indigo-800/80"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Expense</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
