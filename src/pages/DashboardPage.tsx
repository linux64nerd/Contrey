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
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* High-Priority Smart Urgency Spend Alert Banner */}
        <UrgencyBanner />

        {/* Trip Space Header & Switcher */}
        <TripSelector
          trips={trips}
          activeTrip={activeTrip}
          onSelectTrip={(id) => setActiveTripId(id)}
          onCreateNewTrip={handleOpenCreateTrip}
        />

        {/* Action Bar & Section Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'expenses'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expenses Table ({activeTripExpenses.length})
            </button>
            <button
              onClick={() => setActiveTab('settlements')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'settlements'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settlement Plan ({settlementResult.settlements.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/map"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Travel Map</span>
            </Link>

            {activeTrip && (
              <button
                onClick={() => setIsTripShareQrOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all"
                title="Generate Trip Share Pass QR"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share QR</span>
              </button>
            )}

            <button
              onClick={handleOpenEditTrip}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              Edit Trip
            </button>

            <button
              onClick={handleOpenAddExpense}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
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
          <div className="space-y-8">
            {/* 3 Recharts Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Donut Category Distribution */}
              <CategoryDonutChart expenses={activeTripExpenses} />

              {/* Chart 2: Paid vs Fair Share Bar Graph */}
              <BalanceBarChart
                balances={settlementResult.balances}
                baseCurrency={activeTrip.baseCurrency}
              />

              {/* Chart 3: Cumulative Spending Trend Plot */}
              <SpendingTrendPlot
                expenses={activeTripExpenses}
                startDate={activeTrip.startDate}
                endDate={activeTrip.endDate}
                totalBudget={activeTrip.totalBudget}
                baseCurrency={activeTrip.baseCurrency}
              />
            </div>

            {/* Minimum-Transaction Settlement Plan Preview */}
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

            {/* Quick Expenses Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-extrabold text-slate-900">Recent Trip Expenses</h3>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All ({activeTripExpenses.length}) →
                </button>
              </div>
              <ExpenseTable
                expenses={activeTripExpenses}
                travelers={activeTrip.travelers}
                onEditExpense={handleOpenEditExpense}
                onDeleteExpense={deleteExpense}
              />
            </div>
          </div>
        )}

        {/* VIEW TAB: Expenses Table Only */}
        {activeTab === 'expenses' && activeTrip && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">All Logged Expenses</h3>
                <p className="text-xs text-slate-500">
                  Search, filter, edit, or delete any shared payment across categories.
                </p>
              </div>
              <button
                onClick={handleOpenAddExpense}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Expense</span>
              </button>
            </div>

            <ExpenseTable
              expenses={activeTripExpenses}
              travelers={activeTrip.travelers}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={deleteExpense}
            />
          </div>
        )}

        {/* VIEW TAB: Settlement Plan Only */}
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

      {/* Trip Modal */}
      {isTripModalOpen && (
        <TripModal
          isOpen={isTripModalOpen}
          onClose={() => setIsTripModalOpen(false)}
          onSubmit={handleTripSubmit}
          initialTrip={editingTrip}
        />
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && activeTrip && (
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

      {/* Settlement QR Modal */}
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

      {/* Trip Share QR Modal */}
      {isTripShareQrOpen && activeTrip && (
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
