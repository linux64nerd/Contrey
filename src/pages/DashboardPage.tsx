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
import { Plus, Compass, Share2, Receipt, BarChart3, ListFilter, Edit2 } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 page-enter">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Urgency Alert Callout Banner */}
        <UrgencyBanner />

        {/* Top Trip Header & Action Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in-down">
          <div className="flex-1">
            <TripSelector
              trips={trips}
              activeTrip={activeTrip}
              onSelectTrip={setActiveTripId}
              onCreateNewTrip={handleOpenCreateTrip}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {activeTrip && (
              <>
                <button
                  onClick={handleOpenEditTrip}
                  className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
                  title="Edit trip details & travelers"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Trip Config</span>
                </button>

                <button
                  onClick={() => setIsTripShareQrOpen(true)}
                  className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
                  title="Generate Trip Share Pass QR"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Share Pass QR</span>
                </button>

                <Link
                  to="/map"
                  className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
                  title="Explore local spots near trip destination"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Travel Radar</span>
                </Link>

                <button
                  onClick={handleOpenAddExpense}
                  className="btn-primary !py-2 !px-4 !text-xs !rounded-xl hover-lift interactive-press"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </>
            )}
          </div>
        </div>

        {activeTrip ? (
          <>
            {/* 5 KPI Summary Metric Cards */}
            <KpiSummaryCards
              totalBudget={activeTrip.totalBudget}
              totalSpent={settlementResult.totalSpent}
              numTravelers={activeTrip.travelers.length}
              baseCurrency={activeTrip.baseCurrency}
              totalSettlements={settlementResult.settlements.length}
              settledCount={settledCount}
            />

            {/* View Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pt-2 pb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover-lift-sm interactive-press ${
                    activeTab === 'overview'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/90 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics & Visuals</span>
                </button>

                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover-lift-sm interactive-press ${
                    activeTab === 'expenses'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/90 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Expense Ledger ({activeTripExpenses.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settlements')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover-lift-sm interactive-press ${
                    activeTab === 'settlements'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/90 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Settlement Plan ({settlementResult.settlements.length})</span>
                </button>
              </div>

              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
                Auto-saved to device storage
              </span>
            </div>

            {/* Tab 1: Overview & Visual Analytics */}
            {activeTab === 'overview' && (
              <div key="overview" className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Donut Chart */}
                  <CategoryDonutChart expenses={activeTripExpenses} />

                  {/* Individual Balances Bar Chart */}
                  <BalanceBarChart
                    balances={settlementResult.balances}
                    baseCurrency={activeTrip.baseCurrency}
                  />
                </div>

                {/* Spending Velocity Trajectory Area Chart */}
                <SpendingTrendPlot
                  expenses={activeTripExpenses}
                  startDate={activeTrip.startDate}
                  endDate={activeTrip.endDate}
                  totalBudget={activeTrip.totalBudget}
                  baseCurrency={activeTrip.baseCurrency}
                />

                {/* Greedy Settlement List Preview */}
                <SettlementList
                  settlements={settlementResult.settlements}
                  travelers={activeTrip.travelers}
                  baseCurrency={activeTrip.baseCurrency}
                  tripName={activeTrip.name}
                  onToggleSettlement={toggleSettlementStatus}
                  onOpenQr={(settlement, debtor, creditor) => {
                    setActiveQrSettlement({ settlement, debtor, creditor });
                  }}
                />
              </div>
            )}

            {/* Tab 2: Full Expense Ledger */}
            {activeTab === 'expenses' && (
              <div key="expenses" className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Trip Expense Ledger
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Record, search, and manage every group transaction
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddExpense}
                    className="btn-primary !py-1.5 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
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

            {/* Tab 3: Detailed Settlement Plan */}
            {activeTab === 'settlements' && (
              <div key="settlements" className="space-y-4 animate-fade-in-up">
                <SettlementList
                  settlements={settlementResult.settlements}
                  travelers={activeTrip.travelers}
                  baseCurrency={activeTrip.baseCurrency}
                  tripName={activeTrip.name}
                  onToggleSettlement={toggleSettlementStatus}
                  onOpenQr={(settlement, debtor, creditor) => {
                    setActiveQrSettlement({ settlement, debtor, creditor });
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="contrey-card p-12 text-center space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-sm">
              🧭
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                No Active Trip Found
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Create your first trip space to start logging expenses, splitting bills, and settling balances.
              </p>
            </div>
            <button
              onClick={handleOpenCreateTrip}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Trip</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeTrip && (
        <>
          <ExpenseModal
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            onSubmit={handleExpenseSubmit}
            tripId={activeTrip.id}
            travelers={activeTrip.travelers}
            defaultCurrency={activeTrip.baseCurrency}
            initialExpense={editingExpense}
          />

          <TripShareQrModal
            isOpen={isTripShareQrOpen}
            onClose={() => setIsTripShareQrOpen(false)}
            trip={activeTrip}
            totalSpent={settlementResult.totalSpent}
          />
        </>
      )}

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

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSubmit={handleTripSubmit}
        initialTrip={editingTrip}
      />

      <Footer />
    </div>
  );
};
