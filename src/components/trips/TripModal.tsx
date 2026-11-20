import React, { useState, useEffect } from 'react';
import { X, Plane, Users, Plus, Trash2 } from 'lucide-react';
import { Trip, Traveler } from '../../types/trip';
import { CurrencyCode } from '../../types/currency';
import { toast } from 'sonner';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Omit<Trip, 'id' | 'createdAt'>) => void;
  initialTrip?: Trip | null;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTrip,
}) => {
  const [name, setName] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalBudget, setTotalBudget] = useState<string>('');
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('INR');
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  useEffect(() => {
    if (initialTrip) {
      setName(initialTrip.name);
      setDestination(initialTrip.destination);
      setStartDate(initialTrip.startDate);
      setEndDate(initialTrip.endDate);
      setTotalBudget(initialTrip.totalBudget.toString());
      setBaseCurrency(initialTrip.baseCurrency);
      setTravelers(initialTrip.travelers);
    } else {
      setName('');
      setDestination('Goa, India');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
      setTotalBudget('60000');
      setBaseCurrency('INR');
      setTravelers([
        { id: 't_user', name: 'Me (Organizer)', phone: '+919876543210', upiId: 'me@okaxis' },
        { id: `t_${Date.now()}_1`, name: 'Rohan Mehta', phone: '+919820012345', upiId: 'rohan@okaxis' },
        { id: `t_${Date.now()}_2`, name: 'Aisha Khan', phone: '+919876543211', upiId: 'aisha@okhdfc' },
      ]);
    }
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  const handleAddTraveler = () => {
    const newId = `t_${Date.now()}_${travelers.length}`;
    setTravelers((prev) => [
      ...prev,
      { id: newId, name: `Friend ${prev.length + 1}`, phone: '+91', upiId: '' },
    ]);
  };

  const handleRemoveTraveler = (id: string) => {
    if (travelers.length <= 1) {
      toast.error('Trip must have at least one traveler');
      return;
    }
    setTravelers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTraveler = (id: string, field: keyof Traveler, value: string) => {
    setTravelers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a trip name');
      return;
    }
    if (!destination.trim()) {
      toast.error('Please enter a destination');
      return;
    }
    const budgetNum = parseFloat(totalBudget) || 0;
    if (budgetNum <= 0) {
      toast.error('Please enter a total trip budget');
      return;
    }
    if (travelers.some((t) => !t.name.trim())) {
      toast.error('All travelers must have a name');
      return;
    }

    onSubmit({
      userId: 'usr_current',
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      totalBudget: budgetNum,
      baseCurrency,
      travelers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 -rotate-45" />
            <h3 className="text-base font-bold">
              {initialTrip ? 'Edit Trip Settings' : 'Create New Trip'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Trip Name & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trip Name</label>
              <input
                type="text"
                placeholder="e.g. Manali Snow Expedition 🏔️"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination City</label>
              <input
                type="text"
                placeholder="e.g. Goa, Paris, Manali, Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Trip Budget</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 50000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>
          </div>

          {/* Travelers Roster Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Travelers List ({travelers.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddTraveler}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2 py-1 rounded bg-emerald-50"
              >
                <Plus className="w-3 h-3" /> Add Traveler
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {travelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={traveler.name}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="tel"
                      placeholder="WhatsApp (+91...)"
                      value={traveler.phone}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'phone', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="UPI ID (optional)"
                      value={traveler.upiId || ''}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'upiId', e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTraveler(traveler.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all"
            >
              {initialTrip ? 'Save Trip' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
