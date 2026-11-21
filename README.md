# Contrey

> **Travel Smart, Spend Smart**

Group travel frequently descends into post-vacation friction over shared bills, confusing currency conversions across borders, and chaotic multi-party debts. **Contrey** eliminates travel financial anxiety by combining an exact-split ledger, greedy minimum-transaction settlement engine, live multi-currency converter, proactive spend urgency alerts, and a 1–2 km destination exploration radar into a unified, high-performance web notebook.

Built with a minimalist achromatic canvas inspired by Figma's design system, Contrey delivers mathematical certainty, zero-drift financial calculations, and instant local exploration—with zero backend friction.

---

## Core Features

- **Trip Expense Ledger**: Comprehensive expense tracking across 5 core travel categories (*Hotels*, *Food & Dining*, *Transportation*, *Shopping*, *Activities*) supporting both equal splits and custom per-traveler allocations.
- **Greedy Minimum-Transaction Splitter**: Optimal two-pointer debt simplification algorithm that collapses an arbitrary $N$-person cross-debt graph into at most $N - 1$ direct bilateral transfers with mathematical zero penny drift.
- **Live Multi-Currency Engine**: Seamless on-the-fly currency switching across **Indian Rupee (`INR ₹`)**, **Euro (`EUR €`)**, and **US Dollar (`USD $`)** using normalized EUR-pivot exchange math with resilient offline caching.
- **3 Interactive Data Visualizations**:
  - *Category Spend Donut*: Percentage breakdown across categories with dynamic center totals.
  - *Balance Bar Chart*: Side-by-side comparison of total paid vs. fair share, highlighting net debtors and creditors.
  - *Spending Trajectory Area Plot*: Daily spend velocity and cumulative spending plotted against the trip budget cap.
- **1–2 km Destination Radar**: Interactive Leaflet + OpenStreetMap exploration panel featuring zero-API-key basemaps, Nominatim destination geocoding, radius filtering, and 1-click expense logging from curated local recommendations.
- **Spend Urgency & Push Notifications**: Real-time spending anomaly detection with browser Web Push Notifications triggered on $\ge 40\%$ single-item/category spend spikes, $\le 20\%$ remaining budget warnings, and budget cap exhaustion.
- **Multi-Method Auth Gate**: Protected application gate supporting Phone Number + OTP, Email & Password, Google 1-Click, and Username login flows with strict client-side session schema validation.
- **WhatsApp Settlement Reminders**: One-click formatted `wa.me` deep links that pre-fill itemized settlement requests and payee handles.
- **Scannable UPI & Trip QR Codes**: Instant NPCI-compliant `upi://pay` deep link QR generation for Indian UPI apps (GPay, PhonePe, Paytm) and downloadable QR summary passes for group members.

---

## Architecture & Directory Structure

Contrey is structured as a decoupled, modular client-side application. Core mathematical and integration services are completely separated from presentation logic, making the system zero-friction for local demo use and drop-in ready for external backends (Firebase, Supabase, or PostgreSQL).

```
Contrey/
├── docs/
│   ├── ARCHITECTURE.md          # Algorithmic proofs, system design & mathematical specs
│   └── SECURITY_AUDIT.md        # Comprehensive security, logic & reliability audit report
├── scripts/
│   └── verify_audit.ts          # Automated Node/TS verification suite (32 unit tests)
├── src/
│   ├── types/                   # TypeScript interfaces (trip, expense, currency, map, auth)
│   ├── services/
│   │   ├── settlementEngine.ts  # Greedy debt resolution & exact remainder penny distribution
│   │   ├── storageService.ts    # Schema-validated localStorage driver with quota guards
│   │   ├── geocodingService.ts  # OSM Nominatim forward geocoding & Haversine distance math
│   │   └── urgencyService.ts    # Budget threshold evaluator & native push dispatch
│   ├── context/
│   │   ├── TripContext.tsx      # Trip state, active ledger & settlement actions
│   │   ├── CurrencyContext.tsx  # Exchange rate pipeline & normalized EUR pivot converter
│   │   ├── NotificationContext.tsx # In-app notifications & budget alert dispatcher
│   │   ├── AuthContext.tsx      # User authentication session management
│   │   └── ThemeContext.tsx     # Light canvas & dark charcoal palette management
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, ProtectedRoute
│   │   ├── landing/             # HeroSection, FeaturesGrid, HowItWorks
│   │   ├── dashboard/           # BalanceBarChart, CategoryDonut, SpendingTrend, Kpis, SettlementList
│   │   ├── expenses/            # ExpenseModal, ExpenseTable, CategoryBadge
│   │   ├── trips/               # TripModal, TripSelector
│   │   ├── map/                 # DestinationMap, RadiusSelector, RecommendationsPanel
│   │   ├── qr/                  # SettlementQrModal, TripShareQrModal
│   │   └── notifications/       # NotificationCenter modal & toast alerts
│   ├── pages/                   # Route views (LandingPage, DashboardPage, MapPage, etc.)
│   ├── utils/                   # UPI deep link builder, WhatsApp formatter, date formatters
│   ├── App.tsx                  # Root router & context provider tree
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Tailwind design tokens & Figma achromatic styles
├── package.json                 # Project dependencies & npm scripts
├── tsconfig.json                # Strict TypeScript compilation rules
└── vite.config.ts               # Vite bundler configuration
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | React 18 + TypeScript | Component tree, hooks, and compile-time type safety |
| **Build & Tooling** | Vite 5 | Fast HMR dev server and optimized production bundling |
| **Styling & Tokens** | Tailwind CSS 3 | Utility-first Figma achromatic design palette (`#4d49fc`, `#131215`, `#ffffff`) |
| **Visualizations** | Recharts 2 | Responsive SVG charts (Donut, Bar, and Area spending plots) |
| **Mapping Engine** | Leaflet + React-Leaflet | Open-source interactive map canvas with custom SVG markers |
| **Map Tiles & Geocoding** | OpenStreetMap + Nominatim | Zero-key, watermark-free basemap tiles and global destination search |
| **Payment & Sharing** | `qrcode.react` + NPCI UPI Spec | On-the-fly QR code generation for UPI and trip summaries |
| **Messaging & Reminders** | WhatsApp Deep Links (`wa.me`) | Pre-formatted group settlement reminders |
| **Notifications** | Web Notification API + Sonner | Browser push alerts and lightweight in-app toast alerts |
| **Icons & Assets** | Lucide React | Clean, minimalist SVG iconography |

---

## Local Setup & Verification

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+`

### 1. Clone & Install
```bash
git clone https://github.com/sachiny/Contrey.git
cd Contrey
npm install
```

### 2. Configure Environment (Optional)
The project works 100% out of the box using public OpenStreetMap tiles and Frankfurter exchange rates. Optional keys can be placed in `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to explore the application.

### 4. Run TypeScript Quality & Verification Suites
```bash
# Type check without emission
npm run lint

# Run the 32-test automated financial math, security & engine suite
npm run test:audit

# Compile production build
npm run build
```

---

## Security & Financial Integrity Highlights

Contrey has undergone a comprehensive engineering and security audit documented in [`docs/SECURITY_AUDIT.md`](docs/SECURITY_AUDIT.md):

1. **Exact Remainder Cent Distribution**: Solves the classic 3-way floating-point split issue (e.g. ₹100 split 3 ways yields ₹33.34 + ₹33.33 + ₹33.33 = ₹100.00) with guaranteed zero fractional drift.
2. **Mathematical Conservation of Funds**: In every settlement plan, total debtor obligations strictly equal total creditor payouts ($\sum \text{netBalance} = 0$), even when past travelers have been removed.
3. **URI Injection Neutralization**: All parameters passed to UPI payment links (`upi://pay`) and WhatsApp messaging links (`wa.me`) are sanitized against parameter injection delimiters (`&`, `?`, `=`, `#`).
4. **Resilient Network Handling**: External API calls (OSM Nominatim and Frankfurter) are bounded by an `AbortController` 5000ms timeout with automatic offline fallbacks.
5. **Type-Safe Storage Guardrails**: Client-side storage enforces runtime schema guards and handles browser `QuotaExceededError` states without crashing.

For algorithmic proofs and data flow diagrams, refer to [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Deployment & License

- **Deployment**: Contrey is a client-side single page application (SPA). It can be deployed instantly to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
- **License**: MIT License. See [LICENSE](LICENSE) for details.
