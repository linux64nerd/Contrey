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

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'hotel':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'restaurant':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shopping':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'attraction':
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

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
        return 'Attraction / Beach';
    }
  };

  if (places.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 space-y-2">
        <MapPin className="w-8 h-8 mx-auto text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">No places found in this radius</p>
        <p className="text-xs">Try switching to a 2 km search radius or clearing category filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-extrabold text-slate-900">
          Smart Travel Recommendations
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Showing {places.length} top ranked spots
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const convertedPrice = convertAmount(place.estimatedPrice, 'EUR', currentCurrency);

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className={`group relative p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-lg ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Header: Name and Best Value Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider mb-1 ${getCategoryBadgeClass(
                        place.category
                      )}`}
                    >
                      {getCategoryLabel(place.category)}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {place.name}
                    </h4>
                  </div>

                  {place.isBestValue && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-extrabold shadow-sm">
                      <Sparkles className="w-3 h-3" /> Best Value
                    </span>
                  )}
                </div>

                {/* Rating & Distance */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-2.5">
                  <span className="flex items-center gap-1 text-amber-500 font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{place.rating.toFixed(1)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{place.distanceKm} km away</span>
                  </span>
                </div>

                {/* Review Quote */}
                <p className="text-[11px] text-slate-600 italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 line-clamp-2 mb-3">
                  "{place.reviewSnippet}"
                </p>
              </div>

              {/* Price & Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    Estimated Price
                  </span>
                  <span className="text-sm font-black text-emerald-800">
                    {format(convertedPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {onQuickAddExpense && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAddExpense(place);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Log as Trip Expense"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Expense</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlace(place);
                    }}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Focused' : 'View on Map'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
