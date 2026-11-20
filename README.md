# Contrey – Travel Smart, Spend Smart 🌴✈️

An all-in-one group travel expense management web application featuring multi-currency support, smart bill splitting with greedy minimal debt settlement, interactive charts, radius destination maps, browser push notifications, WhatsApp integration, and instant UPI QR payments.

![Contrey Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. 🛡️ Multi-Method Authentication Gate
- Protected routes ensuring all trip data is secured.
- **4 Authentication Methods**:
  - **Phone Number + OTP**: International country codes (`+91`, `+1`, `+44`, `+49`), 10-digit validation, and instant test OTP flow (`123456`).
  - **Email ID**: Email and password login & registration with client validation.
  - **Google Account**: 1-click Google sign-in with instant demo profile fallback.
  - **User ID & Password**: Unique traveler username and password access.
  - **1-Click Demo Login**: Fast testing bypass.

### 2. 💱 Real-Time Multi-Currency Engine
- Supported Currencies: **Indian Rupee (`INR ₹`)**, **Euro (`EUR €`)**, and **US Dollar (`USD $`)**.
- Switch currencies globally from the navbar or dashboard.
- Live exchange rates fetched via Frankfurter API with resilient offline fallbacks.
- Instant conversion across all KPI summaries, graphs, tables, and settlement amounts.

### 3. ⚖️ Smart Expense Splitter & Settlement Engine
- Log shared expenses across 5 categories: **Hotels**, **Food & Dining**, **Transportation**, **Shopping**, and **Activities**.
- **Equal vs. Custom Splits**: Allocate custom amounts per traveler with real-time balance validation.
- **Greedy Minimum-Transaction Algorithm**: Simplifies complex group cross-debts into the minimal number of direct transfers (*"Member A pays Member B — ₹X"*).
- One-click **"Mark Paid / Settled"** debt status tracking.

### 4. 📊 Interactive Recharts Data Visualizations
- **Donut Chart**: Category-wise spend distribution with interactive tooltips and center totals.
- **Bar Graph**: Side-by-side comparison of each traveler's total paid vs. their fair share, highlighting net debtors and creditors.
- **Area / Line Graph**: Daily spend velocity and cumulative spending trajectory against the trip budget cap.

### 5. 🗺️ Interactive Travel Map & Smart Recommendations
- Centered on the trip destination with **Nominatim geocoding** (searches any city worldwide).
- **Radius Filter (`1 km` / `2 km`)**: Visual circle showing nearby spots.
- Categorized custom SVG map pins for **Hotels**, **Restaurants**, **Shopping**, and **Attractions**.
- **Smart Recommendations Panel**: Ranked spots comparing price (in active currency), ratings, distance, and review quotes, with a **"Best Value"** badge for high-rated affordable gems.
- 1-Click **"Log as Expense"** to add recommended spots directly to trip spending.

### 6. 🚨 Urgency Spend Alerts & Push Notifications
- Browser **Web Push Notifications** (`Notification.requestPermission()`) with fallback to urgent in-app banners.
- **Automatic Triggers**:
  - **Heavy Single-Item / Category Spend**: Triggers when any single expense or category consumes **≥ 40%** of the trip budget.
  - **Critical Remaining Budget**: Triggers when remaining funds drop to **≤ 20%** of the budget with an **essentials-only warning**.
  - **Budget Overspend**: Critical alert when spend exceeds 100%.
- **Notification Center**: Bell icon with unread badge, severity tags (`Urgent`, `Warning`, `Info`), and filterable history.

### 7. 💬 WhatsApp & 📱 QR Code Integrations
- **1-Click WhatsApp Settlement**: Opens `wa.me/<phone>` with a pre-filled itemized payment request and UPI ID details.
- **Instant Settlement QR**: Generates scannable UPI deep links (`upi://pay`) for INR or payment receipts for EUR/USD.
- **Trip Share QR Pass**: Share trip summaries with fellow travelers in one scan.
- **Downloadable PNGs** for both QR passes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **Visualizations**: Recharts
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap + Nominatim
- **QR Codes**: `qrcode.react`
- **Routing**: React Router v6
- **Notifications**: Sonner Toasts + Web Notification API
- **Date Handling**: `date-fns`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/linux64nerd/Contrey.git
   cd Contrey
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   *(All features work out of the box with open-source free defaults)*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Guide

### Deploying to Vercel
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import the `Contrey` repository.
4. Framework Preset will auto-detect **Vite**.
5. Click **"Deploy"**.

### Deploying to Netlify
1. Go to [Netlify](https://netlify.com) and click **"Add new site"** > **"Import an existing project"**.
2. Connect your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **"Deploy Contrey"**.

---

## 📄 License
MIT License. Created with ❤️ for travelers worldwide.
