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
      className={`relative overflow-hidden rounded-2xl p-4 border transition-colors ${
        isCritical
          ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-100 shadow-xs'
          : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isCritical
                ? 'bg-rose-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isCritical
                    ? 'bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-200'
                    : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                }`}
              >
                {isCritical ? 'Urgent Alert' : 'Budget Warning'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {primaryAlert.category ? `Category: ${primaryAlert.category}` : 'Trip Budget Guard'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {primaryAlert.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {primaryAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={dismissUrgencyBanner}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
