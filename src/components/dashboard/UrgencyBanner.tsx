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
      className={`relative overflow-hidden rounded-[12px] p-4 border transition-all animate-in fade-in slide-in-from-top-1 ${isCritical
        ? 'bg-[#f64932]/10 border-[#f64932]/30 text-[#000000]'
        : 'bg-[#ffb110]/15 border-[#ffb110]/40 text-[#000000]'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${isCritical ? 'bg-[#f64932] text-[#ffffff]' : 'bg-[#ffb110] text-[#000000]'
              }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'bg-[#f64932] text-[#ffffff]' : 'bg-[#ffb110] text-[#000000]'
                  }`}
              >
                {isCritical ? 'Urgency Alert' : 'Budget Warning'}
              </span>
              <span className="text-xs text-[#757575] font-medium">
                {primaryAlert.category ? `Category: ${primaryAlert.category}` : 'Trip Budget Guard'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#000000]">
              {primaryAlert.title}
            </h4>
            <p className="text-xs text-[#615d59] leading-relaxed">
              {primaryAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={dismissUrgencyBanner}
          className="p-1 rounded-[6px] hover:bg-black/5 text-[#757575] transition-colors"
          title="Dismiss Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
