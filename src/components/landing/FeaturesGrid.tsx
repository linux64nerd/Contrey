import React from 'react';
import { 
  Split, 
  Coins, 
  MapPin, 
  BellRing, 
  MessageSquare, 
  QrCode, 
  BarChart4, 
  LockKeyhole 
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Split,
      color: 'from-emerald-500 to-teal-500',
      title: 'Smart Expense Splitter',
      description: 'Automatically minimizes group transactions. Instead of 10 complicated cross-payments, settle the entire trip with minimal transfers.',
    },
    {
      icon: Coins,
      color: 'from-blue-500 to-indigo-500',
      title: 'Live Multi-Currency (INR, EUR, USD)',
      description: 'Switch currencies dynamically. Real-time rates from Frankfurter API with robust offline fallbacks ensure accurate calculations anywhere.',
    },
    {
      icon: MapPin,
      color: 'from-amber-500 to-orange-500',
      title: 'Radius Travel Map & Recommendations',
      description: 'Discover nearby hotels, cafes, shopping, and tourist attractions within 1-2 km of your destination with price estimates and "Best Value" badges.',
    },
    {
      icon: BellRing,
      color: 'from-rose-500 to-red-500',
      title: 'Urgency Budget Reminders',
      description: 'Push notifications & dashboard banners trigger when a single category eats ≥ 40% of the budget or remaining funds hit critical levels (≤ 20%).',
    },
    {
      icon: MessageSquare,
      color: 'from-emerald-600 to-green-600',
      title: 'One-Click WhatsApp Integration',
      description: 'Send itemized debt summaries and settlement reminders straight to group members via pre-filled WhatsApp messages with a single tap.',
    },
    {
      icon: QrCode,
      color: 'from-purple-500 to-indigo-500',
      title: 'Instant QR Settlement & Sharing',
      description: 'Generate dynamic UPI QR codes (`upi://pay`) for seamless payment execution in INR, plus downloadable trip summary QR passes.',
    },
    {
      icon: BarChart4,
      color: 'from-cyan-500 to-blue-500',
      title: 'Interactive Recharts Analytics',
      description: 'Visual category donuts, paid-vs-fair-share bar graphs, and daily spending velocity line charts keep everyone transparently aligned.',
    },
    {
      icon: LockKeyhole,
      color: 'from-slate-700 to-slate-900',
      title: 'Multi-Method Secure Auth',
      description: 'Log in with Phone + OTP, Email & Password, Google OAuth, or unique User ID credentials with protected route gates.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Engineered For Modern Travelers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need for seamless group trips
          </h2>
          <p className="text-base text-slate-600 font-normal">
            No spreadsheets, no manual conversions, no forgotten IOUs. Just frictionless travel with friends, family, or solo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-5 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
