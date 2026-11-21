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
      <div className="bg-[#ffffff] rounded-[12px] p-8 border border-[rgba(0,0,0,0.08)] text-center text-[#757575] space-y-2">
        <MapPin className="w-8 h-8 mx-auto text-[#757575]" />
        <p className="text-sm font-semibold text-[#000000]">No places found in this radius</p>
        <p className="text-xs">Try switching to a 2 km search radius or clearing category filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-[#000000]">
          Curated Travel Spots
        </h3>
        <span className="text-xs text-[#757575] font-medium">
          {places.length} spots
        </span>
      </div>

      <div className="space-y-3">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const convertedPrice = convertAmount(place.estimatedPrice, 'EUR', currentCurrency);

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className={`group relative p-4 rounded-[12px] border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#e6f3fe]/40 border-[#0075de] ring-1 ring-[#0075de]'
                  : 'bg-[#ffffff] hover:bg-[#f6f5f4] border-[rgba(0,0,0,0.08)]'
              }`}
            >
              {/* Header: Name and Best Value Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f6f5f4] text-[#757575] border border-[rgba(0,0,0,0.08)] mb-1">
                      {getCategoryLabel(place.category)}
                    </span>
                    <h4 className="font-bold text-sm text-[#000000] group-hover:text-[#0075de] transition-colors">
                      {place.name}
                    </h4>
                  </div>

                  {place.isBestValue && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffb110] text-[#000000] text-[10px] font-bold shadow-xs">
                      <Sparkles className="w-3 h-3 text-[#000000]" /> Best Value
                    </span>
                  )}
                </div>

                {/* Rating & Distance */}
                <div className="flex items-center gap-3 text-xs text-[#757575] mb-2">
                  <span className="flex items-center gap-1 font-semibold text-[#000000]">
                    <Star className="w-3.5 h-3.5 fill-[#ffb110] text-[#ffb110]" />
                    <span>{place.rating.toFixed(1)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#757575]" />
                    <span>{place.distanceKm} km away</span>
                  </span>
                </div>

                {/* Review Quote */}
                <p className="text-xs text-[#615d59] italic bg-[#f6f5f4] p-2.5 rounded-[8px] border border-[rgba(0,0,0,0.06)] line-clamp-2 mb-3">
                  "{place.reviewSnippet}"
                </p>
              </div>

              {/* Price & Actions Footer */}
              <div className="pt-3 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#757575] font-semibold block">
                    Estimated
                  </span>
                  <span className="text-sm font-bold text-[#0075de]">
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
                      className="px-2.5 py-1 rounded-[6px] bg-[#f6f5f4] hover:bg-[#e6f3fe] text-[#000000] hover:text-[#0075de] border border-[rgba(0,0,0,0.08)] text-xs font-medium flex items-center gap-1 transition-colors"
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
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#0075de] text-[#ffffff] shadow-xs'
                        : 'bg-[#ffffff] hover:bg-[#f6f5f4] text-[#757575] border border-[rgba(0,0,0,0.1)]'
                    }`}
                  >
                    <span>{isSelected ? 'Selected' : 'View'}</span>
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
