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
      notes: `Recommendation: ${place.name} (${place.distanceKm} km away)`,
    });
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f4] text-[#000000] font-sans selection:bg-[#e6f3fe] selection:text-[#0075de]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/dashboard"
                className="text-xs font-medium text-[#757575] hover:text-[#0075de] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <span className="text-[#757575]">•</span>
              <span className="text-xs font-semibold text-[#0075de] uppercase tracking-wider">
                Travel Map
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
              <span>Destination map & recommendations</span>
              <span>🗺️</span>
            </h1>
          </div>

          {/* Search Geocoding Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full sm:w-auto">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[#757575]" />
              <input
                type="text"
                placeholder="Search any destination city..."
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-[8px] border border-[rgba(0,0,0,0.12)] text-xs text-[#000000] bg-[#ffffff] placeholder:text-[#757575] focus:outline-none focus:border-[#0075de]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-colors shadow-xs"
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
          {/* Left Column: Interactive Leaflet Map */}
          <div className="lg:col-span-7 bg-[#ffffff] p-3 rounded-[12px] border border-[rgba(0,0,0,0.08)]">
            <DestinationMap
              center={mapCenter}
              radiusKm={radiusKm}
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
            />
          </div>

          {/* Right Column: Recommendations Panel */}
          <div className="lg:col-span-5 space-y-4">
            <RecommendationsPanel
              places={sortedPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
              onQuickAddExpense={activeTrip ? handleQuickAddExpense : undefined}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Quick Add Expense Modal */}
      {activeTrip && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={(expenseData) => addExpense(expenseData)}
          tripId={activeTrip.id}
          travelers={activeTrip.travelers}
          defaultCurrency={activeTrip.baseCurrency}
          initialExpense={prefilledExpense}
        />
      )}
    </div>
  );
};
