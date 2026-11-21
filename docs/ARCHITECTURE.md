# Contrey — System Architecture & Engineering Rigor

Contrey is an enterprise-grade, client-first group travel notebook and expense optimization system. Designed with an achromatic, minimalist design system (inspired by Figma's canvas aesthetic), Contrey delivers mathematical certainty in group debt simplification, real-time currency conversion, and instant geographic exploration—with zero backend overhead for seamless local and offline execution.

---

## 1. High-Level Architecture Overview

Contrey follows a clean, decoupled client-side architecture composed of five distinct layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. Presentation Layer                           │
│  React 18 + TypeScript + Tailwind CSS (Figma Achromatic Design Tokens) │
│  Pages: LandingPage, DashboardPage, MapRecommendationsPage, Auth       │
│  Components: Charts (Recharts), Leaflet OSM Maps, QR Modals, Forms    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ consumes
┌───────────────────────────────────▼────────────────────────────────────┐
│                    2. Context & State Management                       │
│  TripContext: Trips, Active Trip, Expenses, Split Actions              │
│  CurrencyContext: Base Rates, Real-Time Conversions, Symbols           │
│  NotificationContext: Spend Alerts, Push Dispatch, In-App Logs         │
│  AuthContext: Multi-Method Mock Auth & Local Session Persistence       │
│  ThemeContext: Light Canvas / Dark Charcoal System Themes              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ invokes
┌───────────────────────────────────▼────────────────────────────────────┐
│                    3. Core Algorithmic Engines                         │
│  • Settlement Engine: Greedy Minimum-Transaction Debt Simplifier       │
│  • Financial Math: Exact Remainder Cent Balancing (Zero Drift)         │
│  • Urgency Engine: Budget Cap & Spending Anomaly Evaluator             │
│  • Geocoding Engine: OSM Nominatim Forward Geocoder & Haversine Math   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ persists / links
┌───────────────────────────────────▼────────────────────────────────────┐
│                    4. Storage & Integration Layer                      │
│  • StorageService: Type-Safe localStorage Driver with Quota Guards     │
│  • UPI Deep Links: NPCI-Compliant URI Parameter Sanitizer              │
│  • WhatsApp API: Universal wa.me International Link Generator          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Algorithmic Modules

### 2.1 Greedy Minimum-Transaction Debt Simplification (`src/services/settlementEngine.ts`)

In an arbitrary group trip with $N$ travelers and multiple shared expenses, peer-to-peer debts form a complex directed multi-graph. Left unoptimized, settling debts requires up to $O(N^2)$ separate transactions, creating logistical friction.

Contrey reduces this directed graph to **at most $N - 1$ bilateral transfers** using an optimal greedy two-pointer strategy.

#### Algorithmic Invariants:
1. **Mathematical Conservation of Funds:**
   $$\sum_{i=1}^{N} \text{netBalance}_i = 0$$
   Every cent owed by a debtor is strictly received by a creditor.
2. **Integer-Cent Precision:**
   All calculations are performed using integer cents:
   $$\text{cents} = \text{round}(\text{amount} \times 100)$$
   This guarantees complete immunity from IEEE 754 floating-point rounding errors.
3. **Exact Remainder Penny Allocation (`calculateExactEqualSplits`):**
   When an expense cannot be divided evenly (e.g. ₹100 split 3 ways):
   $$\text{baseCents} = \lfloor 10000 / 3 \rfloor = 3333 \quad (\text{₹}33.33)$$
   $$\text{remainderCents} = 10000 \pmod 3 = 1 \quad (\text{₹}0.01)$$
   The engine distributes remainder pennies deterministically to the first $k$ travelers, ensuring the sum of splits equals the expense total with **zero fractional drift**.
4. **Greedy Bilateral Settle:**
   - Debtors and creditors are sorted in descending order of debt magnitude ($O(N \log N)$).
   - In each step, $\min(\text{debtor.cents}, \text{creditor.cents})$ is transferred.
   - At least one traveler's balance is completely extinguished to zero per iteration, terminating in at most $N - 1$ transactions.

---

### 2.2 Multi-Currency Normalization Pivot (`src/context/CurrencyContext.tsx`)

Group trips often span multiple international borders, mixing expenses logged in `INR`, `EUR`, and `USD`.

Contrey uses **EUR as a normalized pivot currency**:
$$\text{amount}_{\text{to}} = \left( \frac{\text{amount}_{\text{from}}}{\text{rate}_{\text{from}}} \right) \times \text{rate}_{\text{to}}$$

#### Runtime Safeguards:
- **Frankfurter API Integration:** Fetches live ECB exchange rates asynchronously.
- **5000ms AbortController Timeout:** Prevents UI loading stalls if network connectivity drops or the endpoint is rate-limited.
- **Offline Fallback Matrix:** Bundles hardcoded static exchange rates (`EUR: 1`, `USD: 1.09`, `INR: 91.50`) so offline users and judges never experience a broken UI.

---

### 2.3 Proactive Spend Urgency Engine (`src/services/urgencyService.ts`)

To prevent post-vacation financial shock, Contrey continuously analyzes spending patterns against trip budgets:

| Alert Trigger | Threshold | User Guidance |
|---|---|---|
| **Single Heavy Expense** | $\ge 40\%$ of total budget | Warns group that a single line item consumed a dominant share of funds. |
| **Category Concentration** | $\ge 40\%$ in one category | Recommends rebalancing remaining days (e.g. high dining vs activities). |
| **Critical Budget Level** | $\le 20\%$ remaining budget | Advises immediate austerity: funds restricted to food, transport, and emergencies. |
| **Overspend Breach** | $> 100\%$ budget consumed | Flags critical debt condition: any further expense increases outstanding balance. |

Alerts automatically trigger native **Web Browser Push Notifications** (with user permission) and persist inside the in-app Notification Center with deduplication signatures.

---

### 2.4 Destination Radar & Geolocation Engine (`src/services/geocodingService.ts`)

Contrey features an interactive 1–2 km destination radar powered by Leaflet and OpenStreetMap:
- **Zero API Key Requirement:** Default basemaps run on OpenStreetMap public tiles with zero external key friction, zero quotas, and zero watermarks.
- **Forward Geocoding:** Queries the OpenStreetMap Nominatim API with a 5000ms `AbortController` timeout and pre-indexed coordinates for global travel hubs (Paris, Tokyo, Goa, Bali, London, New York).
- **Haversine Distance Math:** Computes spherical surface distances between destination anchors and points of interest:
  $$d = 2R \arcsin \left( \sqrt{\sin^2(\Delta \phi / 2) + \cos \phi_1 \cos \phi_2 \sin^2(\Delta \lambda / 2)} \right)$$
- **1-Click Expense Prefill:** Users can tap any curated local recommendation on the radar to instantly open an expense card pre-filled with place name, estimated local price, and category.

---

## 3. Financial Integration & Security Guardrails

### 3.1 NPCI UPI Deep Links (`src/utils/upi.ts`)
- Implements standard National Payments Corporation of India (NPCI) URI schema:
  `upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>`
- **Injection Sanitization:** Strips query delimiter characters (`&`, `?`, `=`, `#`) from payee names and transaction notes to prevent URI parameter injection.
- **VPA Syntax Validation:** Validates virtual payment handles using official provider patterns (`^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$`).

### 3.2 WhatsApp Settlement Reminders (`src/utils/whatsapp.ts`)
- Normalizes international phone numbers by stripping formatting characters into pure E.164-compatible digits.
- Generates clean, polite Markdown reminders with exact amounts, payee handles, and trip context.
- **Universal Fallback:** When a phone number is omitted, generates a universal `https://wa.me/?text=...` share link allowing the user to select any contact natively.

### 3.3 Storage Resiliency (`src/services/storageService.ts`)
- Encapsulates `localStorage` with JSON serialization safeguards.
- Handles browser private-mode `QuotaExceededError` exceptions gracefully.
- Validates user objects and trip data structures against strict TypeScript schemas on read.

---

## 4. Verification Suite & Audited Benchmarks

Contrey includes an automated Node/TypeScript test suite (`scripts/verify_audit.ts`):
- **32 / 32 Passed Tests (100% Success Rate)**
- Validates exact penny split distribution (3-way, 4-way, 7-way).
- Verifies fund conservation across normal and former/deleted traveler expenses.
- Verifies UPI parameter sanitization and VPA regex checks.
- Validates phone normalization and WhatsApp URL structures.
- Tests geocoding coordinate bounding $(-90 \le \text{lat} \le 90, -180 \le \text{lng} \le 180)$.

Run tests locally:
```bash
npm run test:audit
```
