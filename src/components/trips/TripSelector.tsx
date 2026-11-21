import React from 'react';
import { Trip } from '../../types/trip';
import { Calendar, Plus, ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface TripSelectorProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (id: string) => void;
  onCreateNewTrip: () => void;
}

export const TripSelector: React.FC<TripSelectorProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onCreateNewTrip,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-[12px] border border-[rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[8px] bg-[#f6f5f4] text-[#000000] flex items-center justify-center font-bold border border-[rgba(0,0,0,0.06)] text-xl">
          🏖️
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#757575] block">
            Trip Space
          </span>
          <div className="relative inline-block mt-0.5">
            <select
              value={activeTrip?.id || ''}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="appearance-none pr-8 bg-transparent text-lg font-bold text-[#000000] cursor-pointer focus:outline-none hover:text-[#0075de]"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.destination})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#757575] absolute right-1 top-1.5 pointer-events-none" />
          </div>
          {activeTrip && (
            <div className="flex items-center gap-2 text-xs text-[#757575] font-normal mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#757575]" />
              <span>
                {formatDate(activeTrip.startDate)} – {formatDate(activeTrip.endDate)}
              </span>
              <span>•</span>
              <span>{activeTrip.travelers.length} Travelers</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCreateNewTrip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-[#ffffff]" />
          <span>New Trip</span>
        </button>
      </div>
    </div>
  );
};
