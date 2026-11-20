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
import { ExpenseCategory } from '../types/expense';
import { MapPin, ArrowLeft } from 'lucide-react';
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
  const [prefilledExpense, setPrefilledExpense] = useState<any>(null);

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
      notes: `Smart Recommendation: ${place.name} (${place.distanceKm} km away)`,
    });
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Interactive Travel Map
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Explore Destination & Smart Spots</span>
              <span className="text-emerald-600">🗺️</span>
            </h1>
          </div>

          {/* Search Geocoding Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search any destination city..."
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Bar */}
        <RadiusSelector
          radiusKm={radiusKm}
          onSelectRadius={setRadiusKm}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSelectSortBy={setSortBy}
          totalFound={sortedPlaces.length}
        />

        {/* Map and Recommendations Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Map (55%) */}
          <div className="lg:col-span-7">
            <DestinationMap
              center={mapCenter}
              destinationName={destinationQuery}
              radiusKm={radiusKm}
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => setSelectedPlace(place)}
            />
          </div>

          {/* Right Column: Smart Recommendations List (45%) */}
          <div className="lg:col-span-5 max-h-[600px] overflow-y-auto pr-1">
            <RecommendationsPanel
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => setSelectedPlace(place)}
              onQuickAddExpense={handleQuickAddExpense}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick Add Expense Modal */}
      {isExpenseModalOpen && activeTrip && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={(expenseData) => {
            addExpense(expenseData);
            setIsExpenseModalOpen(false);
          }}
          tripId={activeTrip.id}
          travelers={activeTrip.travelers}
          defaultCurrency={activeTrip.baseCurrency}
          initialExpense={prefilledExpense}
        />
      )}
    </div>
  );
};
