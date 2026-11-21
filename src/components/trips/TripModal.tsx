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

    // Validate dates
    if (startDate && endDate) {
      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime();
      if (endMs < startMs) {
        toast.error('Trip end date cannot be earlier than start date');
        return;
      }
    }

    if (travelers.length === 0) {
      toast.error('At least one traveler is required');
      return;
    }

    if (travelers.some((t) => !t.name.trim())) {
      toast.error('All travelers must have a non-empty name');
      return;
    }

    const sanitizedTravelers = travelers.map((t) => ({
      ...t,
      name: t.name.trim().slice(0, 50),
      phone: t.phone.trim().slice(0, 20),
      upiId: t.upiId ? t.upiId.trim().slice(0, 50) : undefined,
    }));

    onSubmit({
      userId: 'usr_current',
      name: cleanName,
      destination: cleanDestination,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      totalBudget: Math.round(budgetNum * 100) / 100,
      baseCurrency,
      travelers: sanitizedTravelers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#ffffff] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#0075de] -rotate-45" />
            <h3 className="text-base font-bold text-[#000000]">
              {initialTrip ? 'Edit Trip Notebook' : 'Create New Trip Notebook'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] hover:bg-[#f6f5f4] text-[#757575] hover:text-[#000000] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-normal">
          {/* Trip Name & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Trip Name
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Manali Snow Expedition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Destination City
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Goa, Paris, Manali, Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Total Trip Budget
              </label>
              <input
                type="number"
                min="1"
                max="1000000000"
                step="0.01"
                placeholder="e.g. 50000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] font-bold focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Base Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
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
              <label className="text-xs font-medium text-[#000000] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0075de]" />
                <span>Travelers List ({travelers.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddTraveler}
                className="text-xs font-medium text-[#0075de] hover:underline flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#e6f3fe]"
              >
                <Plus className="w-3 h-3" /> Add Traveler
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {travelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="p-2.5 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.08)] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      maxLength={50}
                      placeholder="Name"
                      value={traveler.name}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[6px] bg-[#ffffff] border border-[rgba(0,0,0,0.1)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="tel"
                      maxLength={20}
                      placeholder="Phone (+91...)"
                      value={traveler.phone}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'phone', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[6px] bg-[#ffffff] border border-[rgba(0,0,0,0.1)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      maxLength={50}
                      placeholder="UPI ID (optional)"
                      value={traveler.upiId || ''}
                      onChange={(e) => handleUpdateTraveler(traveler.id, 'upiId', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[6px] bg-[#ffffff] border border-[rgba(0,0,0,0.1)] text-[#000000] focus:outline-none focus:border-[#0075de]"
                    />
                  </div>

                  <div className="sm:col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveTraveler(traveler.id)}
                      className="p-1 rounded-[6px] text-[#757575] hover:text-[#f64932] transition-colors"
                      title="Remove traveler"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[rgba(0,0,0,0.08)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] text-[#757575] hover:text-[#000000] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] font-medium shadow-xs transition-colors"
            >
              {initialTrip ? 'Save Changes' : 'Create Notebook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
