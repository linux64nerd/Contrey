import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useTrip } from '../context/TripContext';
import { TripSelector } from '../components/trips/TripSelector';
import { TripModal } from '../components/trips/TripModal';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { KpiSummaryCards } from '../components/dashboard/KpiSummaryCards';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { BalanceBarChart } from '../components/dashboard/BalanceBarChart';
import { SpendingTrendPlot } from '../components/dashboard/SpendingTrendPlot';
import { SettlementList } from '../components/dashboard/SettlementList';
import { UrgencyBanner } from '../components/dashboard/UrgencyBanner';
import { SettlementQrModal } from '../components/qr/SettlementQrModal';
import { TripShareQrModal } from '../components/qr/TripShareQrModal';
import { Expense } from '../types/expense';
import { Settlement, Traveler } from '../types/trip';
import { Plus, Compass, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const {
    trips,
    activeTrip,
    setActiveTripId,
    createTrip,
    updateTrip,
    activeTripExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    settlementResult,
    toggleSettlementStatus,
  } = useTrip();

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState<boolean>(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // QR Modals state
  const [activeQrSettlement, setActiveQrSettlement] = useState<{
    settlement: Settlement;
    debtor: Traveler;
    creditor: Traveler;
  } | null>(null);

  const [isTripShareQrOpen, setIsTripShareQrOpen] = useState<boolean>(false);

  // Active view tab: 'overview' | 'expenses' | 'settlements'
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'settlements'>('overview');

  const settledCount = settlementResult.settlements.filter((s) => s.isSettled).length;

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (expenseData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
  };

  const handleOpenCreateTrip = () => {
    setEditingTrip(null);
    setIsTripModalOpen(true);
  };

  const handleOpenEditTrip = () => {
    setEditingTrip(activeTrip);
    setIsTripModalOpen(true);
  };

  const handleTripSubmit = (tripData: any) => {
    if (editingTrip) {
      updateTrip(editingTrip.id, tripData);
    } else {
      createTrip(tripData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f4] text-[#000000] font-sans selection:bg-[#e6f3fe] selection:text-[#0075de]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Urgency Alert Callout Banner */}
        <UrgencyBanner />

        {/* Trip Notebook Header & Switcher */}
        <TripSelector
          trips={trips}
          activeTrip={activeTrip}
          onSelectTrip={(id) => setActiveTripId(id)}
          onCreateNewTrip={handleOpenCreateTrip}
        />

        {/* Action Bar & Section Tabs (Notion 8px pill selector) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex p-1 bg-[#ffffff] rounded-[8px] border border-[rgba(0,0,0,0.08)] text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#f6f5f4] text-[#000000] font-semibold shadow-xs'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'expenses'
                  ? 'bg-[#f6f5f4] text-[#000000] font-semibold shadow-xs'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              Expenses ({activeTripExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab('settlements')}
              className={`px-3 py-1.5 rounded-[6px] transition-all ${
                activeTab === 'settlements'
                  ? 'bg-[#f6f5f4] text-[#000000] font-semibold shadow-xs'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              Settlement Plan ({settlementResult.settlements.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/map"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-[#ffffff] hover:bg-[#f6f5f4] border border-[rgba(0,0,0,0.1)] text-[#000000] text-xs font-medium transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#0075de]" />
              <span>Explore Map</span>
            </Link>

            {activeTrip && (
              <button
                onClick={() => setIsTripShareQrOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] bg-[#ffffff] hover:bg-[#f6f5f4] border border-[rgba(0,0,0,0.1)] text-[#615d59] hover:text-[#000000] text-xs font-medium transition-colors"
                title="Generate Trip Share Pass QR"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share QR</span>
              </button>
            )}

            <button
              onClick={handleOpenEditTrip}
              className="px-3.5 py-1.5 rounded-[8px] border border-[rgba(0,0,0,0.1)] bg-[#ffffff] hover:bg-[#f6f5f4] text-[#615d59] hover:text-[#000000] text-xs font-medium transition-colors"
            >
              Edit Trip
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleOpenAddExpense}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Expense</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Summary Cards */}
        {activeTrip && (
          <KpiSummaryCards
            totalBudget={activeTrip.totalBudget}
            totalSpent={settlementResult.totalSpent}
            numTravelers={activeTrip.travelers.length}
            baseCurrency={activeTrip.baseCurrency}
            totalSettlements={settlementResult.settlements.length}
            settledCount={settledCount}
          />
        )}

        {/* VIEW TAB: Overview & Analytics */}
        {activeTab === 'overview' && activeTrip && (
          <div className="space-y-6">
            {/* 3 Recharts Visualizations (Pure white cards, 12px radius, no shadow) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Donut Category Distribution */}
              <CategoryDonutChart expenses={activeTripExpenses} />

              {/* Chart 2: Net Balances Paid vs Fair Share */}
              <BalanceBarChart
                balances={settlementResult.balances}
                baseCurrency={activeTrip.baseCurrency}
              />

              {/* Chart 3: Cumulative Spending Velocity Plot */}
              <SpendingTrendPlot
                expenses={activeTripExpenses}
                startDate={activeTrip.startDate}
                endDate={activeTrip.endDate}
                totalBudget={activeTrip.totalBudget}
                baseCurrency={activeTrip.baseCurrency}
              />
            </div>

            {/* Quick Settlement Summary Section */}
            <SettlementList
              settlements={settlementResult.settlements}
              travelers={activeTrip.travelers}
              baseCurrency={activeTrip.baseCurrency}
              tripName={activeTrip.name}
              onToggleSettlement={toggleSettlementStatus}
              onOpenQr={(settlement, debtor, creditor) =>
                setActiveQrSettlement({ settlement, debtor, creditor })
              }
            />
          </div>
        )}

        {/* VIEW TAB: Expenses Table */}
        {activeTab === 'expenses' && activeTrip && (
          <div className="space-y-4">
            <ExpenseTable
              expenses={activeTripExpenses}
              travelers={activeTrip.travelers}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={deleteExpense}
            />
          </div>
        )}

        {/* VIEW TAB: Settlements */}
        {activeTab === 'settlements' && activeTrip && (
          <div className="space-y-4">
            <SettlementList
              settlements={settlementResult.settlements}
              travelers={activeTrip.travelers}
              baseCurrency={activeTrip.baseCurrency}
              tripName={activeTrip.name}
              onToggleSettlement={toggleSettlementStatus}
              onOpenQr={(settlement, debtor, creditor) =>
                setActiveQrSettlement({ settlement, debtor, creditor })
              }
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Trip Modal (Create/Edit) */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSubmit={handleTripSubmit}
        initialTrip={editingTrip}
      />

      {/* Expense Modal (Create/Edit) */}
      {activeTrip && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          tripId={activeTrip.id}
          travelers={activeTrip.travelers}
          defaultCurrency={activeTrip.baseCurrency}
          initialExpense={editingExpense}
        />
      )}

      {/* Individual Settlement QR Modal */}
      {activeQrSettlement && activeTrip && (
        <SettlementQrModal
          isOpen={!!activeQrSettlement}
          onClose={() => setActiveQrSettlement(null)}
          settlement={activeQrSettlement.settlement}
          debtor={activeQrSettlement.debtor}
          creditor={activeQrSettlement.creditor}
          baseCurrency={activeTrip.baseCurrency}
        />
      )}

      {/* Trip Share Pass QR Modal */}
      {activeTrip && (
        <TripShareQrModal
          isOpen={isTripShareQrOpen}
          onClose={() => setIsTripShareQrOpen(false)}
          trip={activeTrip}
          totalSpent={settlementResult.totalSpent}
        />
      )}
    </div>
  );
};
