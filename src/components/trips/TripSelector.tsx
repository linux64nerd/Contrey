import React from 'react';
import { Trip } from '../../types/trip';
import { Calendar, Plus, ChevronDown, MapPin } from 'lucide-react';
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
    <div className="contrey-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-xs shrink-0">
          🏖️
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            Active Trip Space
          </span>
          <div className="relative inline-block mt-0.5">
            <select
              value={activeTrip?.id || ''}
              onChange={(e) => onSelectTrip(e.target.value)}
              className="appearance-none pr-8 bg-transparent font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white cursor-pointer focus:outline-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-slate-900 dark:text-white">
                  {t.name} ({t.destination})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-1 top-2 pointer-events-none" />
          </div>
          {activeTrip && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeTrip.destination}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {formatDate(activeTrip.startDate)} – {formatDate(activeTrip.endDate)}
                </span>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {activeTrip.travelers.length} Travelers
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCreateNewTrip}
          className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>New Trip</span>
        </button>
      </div>
    </div>
  );
};
