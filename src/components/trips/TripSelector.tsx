import React from 'react';
import { Trip } from '../../types/trip';
import { MapPin, Calendar, Plus, ChevronDown } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100 shadow-sm">
          <MapPin className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Active Trip Space
          </span>
          <div className="relative inline-block">
            <select
              value={activeTrip?.id || ''}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="appearance-none pr-8 bg-transparent text-lg font-extrabold text-slate-900 cursor-pointer focus:outline-none focus:underline"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.destination})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-1 top-2 pointer-events-none" />
          </div>
          {activeTrip && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip</span>
        </button>
      </div>
    </div>
  );
};
