import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useTrip } from '../context/TripContext';
import { DestinationMap } from '../components/map/DestinationMap';
import { RadiusSelector } from '../components/map/RadiusSelector';
import { RecommendationsPanel } from '../components/map/RecommendationsPanel';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { geocodeDestination, getCuratedRecommendations } from '../services/geocodingService';
import { PlaceRecommendation } from '../types/map';
import { Expense, ExpenseCategory } from '../types/expense';
import { MapPin, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapRecommendationsPage: React.FC = () => {
  const { activeTrip, addExpense } = useTrip();

  const [destinationQuery, setDestinationQuery] = useState<string>(
    activeTrip?.destination || 'Goa, India'
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([15.2993, 74.1240]);
  const [radiusKm, setRadiusKm] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'best-value' | 'rating' | 'price' | 'distance'>('best-value');
  const [selectedPlace, setSelectedPlace] = useState<PlaceRecommendation | null>(null);

  // Quick Expense modal from place
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [prefilledExpense, setPrefilledExpense] = useState<Partial<Expense> | null>(null);

  // Sync with active trip destination
  useEffect(() => {
    if (activeTrip?.destination) {
      setDestinationQuery(activeTrip.destination);
      handleSearchDestination(activeTrip.destination);
    }
  }, [activeTrip]);

  const handleSearchDestination = async (query: string) => {
    if (!query.trim()) return;
    const geo = await geocodeDestination(query);
    setMapCenter([geo.lat, geo.lng]);
    setSelectedPlace(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchDestination(destinationQuery);
  };

  // Get places within radius
  const rawPlaces = getCuratedRecommendations(
    mapCenter[0],
    mapCenter[1],
    radiusKm,
    destinationQuery
  );

  // Filter by category
  const filteredPlaces = rawPlaces.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  // Sort places
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === 'best-value') {
      if (a.isBestValue && !b.isBestValue) return -1;
      if (!a.isBestValue && b.isBestValue) return 1;
      return b.rating - a.rating;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'price') {
      return a.estimatedPrice - b.estimatedPrice;
    }
    if (sortBy === 'distance') {
      return a.distanceKm - b.distanceKm;
    }
    return 0;
  });

  const handleQuickAddExpense = (place: PlaceRecommendation) => {
    if (!activeTrip) return;
    let mappedCat: ExpenseCategory = 'Activities';
    if (place.category === 'hotel') mappedCat = 'Hotels';
    if (place.category === 'restaurant') mappedCat = 'Food';
    if (place.category === 'shopping') mappedCat = 'Shopping';

    setPrefilledExpense({
      title: place.name,
      amount: place.estimatedPrice,
      currency: 'EUR',
      category: mappedCat,
      notes: `Recommendation: ${place.name} (${place.distanceKm} km away)`,
    });
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 block">
                Local Exploration
              </span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Destination Radar & Curated Spots
              </h1>
            </div>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Search destination (e.g. Goa, Paris, Tokyo, Bali)"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="btn-primary !py-2 !px-4 !text-xs !rounded-xl shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
          </form>
        </div>

        {/* Filters and Radius Selector */}
        <RadiusSelector
          radiusKm={radiusKm}
          onSelectRadius={setRadiusKm}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSelectSortBy={setSortBy}
          totalFound={sortedPlaces.length}
        />

        {/* Map and Place List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Leaflet Map (7 Cols) */}
          <div className="lg:col-span-7 h-[420px] sm:h-[540px] contrey-card overflow-hidden shadow-lg relative dark:border-slate-800">
            <DestinationMap
              center={mapCenter}
              destinationName={destinationQuery}
              radiusKm={radiusKm}
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
            />
          </div>

          {/* Place Cards Panel (5 Cols) */}
          <div className="lg:col-span-5 h-[420px] sm:h-[540px] overflow-y-auto pr-1">
            <RecommendationsPanel
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
              onQuickAddExpense={handleQuickAddExpense}
            />
          </div>
        </div>
      </main>

      {/* Quick Add Expense Modal */}
      {activeTrip && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={(data) => addExpense(data)}
          tripId={activeTrip.id}
          travelers={activeTrip.travelers}
          defaultCurrency={activeTrip.baseCurrency}
          initialExpense={prefilledExpense}
        />
      )}

      <Footer />
    </div>
  );
};
