import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export const UrgencyBanner: React.FC = () => {
  const { currentUrgency, isUrgencyBannerDismissed, dismissUrgencyBanner } = useNotifications();

  if (!currentUrgency || !currentUrgency.hasCriticalAlert || isUrgencyBannerDismissed) {
    if (!currentUrgency?.hasWarningAlert || isUrgencyBannerDismissed) {
      return null;
    }
  }

  const primaryAlert = currentUrgency.alerts[0];
  if (!primaryAlert) return null;

  const isCritical = primaryAlert.severity === 'urgent';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 shadow-lg border transition-all animate-in fade-in slide-in-from-top-2 ${
        isCritical
          ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white border-rose-500/40'
          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/40'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider">
                {isCritical ? 'URGENCY REMINDER' : 'BUDGET CAUTION'}
              </span>
              <span className="text-xs font-bold text-white/90">
                {primaryAlert.category ? `Category: ${primaryAlert.category}` : 'Trip Budget Guard'}
              </span>
            </div>

            <h4 className="text-base font-extrabold tracking-tight text-white">
              {primaryAlert.title}
            </h4>
            <p className="text-xs text-white/95 leading-relaxed font-medium max-w-3xl">
              {primaryAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={dismissUrgencyBanner}
          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
