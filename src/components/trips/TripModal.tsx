import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plane, Plus, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddTraveler = () => {
    if (travelers.length >= 25) {
      toast.error('Maximum 25 travelers allowed per trip');
      return;
    }
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
    const cleanName = name.trim().slice(0, 80);
    const cleanDestination = destination.trim().slice(0, 80);

    if (!cleanName) {
      toast.error('Please enter a trip name');
      return;
    }
    if (!cleanDestination) {
      toast.error('Please enter a destination');
      return;
    }

    const budgetNum = parseFloat(totalBudget);
    if (!isFinite(budgetNum) || isNaN(budgetNum) || budgetNum <= 0) {
      toast.error('Please enter a valid total trip budget greater than 0');
      return;
    }
    if (budgetNum > 1000000000) {
      toast.error('Budget cannot exceed 1,000,000,000');
      return;
    }

    if (travelers.length === 0) {
      toast.error('At least one traveler is required');
      return;
    }

    // Clean travelers
    const sanitizedTravelers = travelers.map((t, idx) => ({
      id: t.id || `t_${Date.now()}_${idx}`,
      name: t.name.trim().slice(0, 40) || `Traveler ${idx + 1}`,
      phone: t.phone.trim().slice(0, 20),
      upiId: t.upiId ? t.upiId.trim().slice(0, 50) : undefined,
    }));

    onSubmit({
      name: cleanName,
      destination: cleanDestination,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      totalBudget: budgetNum,
      baseCurrency,
      travelers: sanitizedTravelers,
      userId: initialTrip?.userId || 'usr_organizer',
    });

    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 overflow-y-auto bg-slate-900/60 transition-opacity duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl my-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                {initialTrip ? 'Configure Trip Space' : 'Create New Trip Space'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup destination anchor, crew members, and base ledger currency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Trip Name & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trip Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Goa Sun & Sand 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Destination Anchor *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Goa, India or Bali, Indonesia"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Budget & Base Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Budget Target *
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="60000"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Travelers Management */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Crew Members ({travelers.length})
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Add phone numbers for WhatsApp & UPI handles for instant QR
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTraveler}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {travelers.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => handleUpdateTraveler(t.id, 'name', e.target.value)}
                    placeholder="Traveler Name"
                    className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <input
                    type="tel"
                    value={t.phone}
                    onChange={(e) => handleUpdateTraveler(t.id, 'phone', e.target.value)}
                    placeholder="+91 Phone"
                    className="w-28 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={t.upiId || ''}
                    onChange={(e) => handleUpdateTraveler(t.id, 'upiId', e.target.value)}
                    placeholder="UPI ID"
                    className="w-28 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  {travelers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTraveler(t.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2 !px-4 !text-xs !rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary !py-2 !px-5 !text-xs !rounded-xl"
            >
              {initialTrip ? 'Update Trip Space' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
