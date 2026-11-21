import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, Trash2, ShieldAlert, AlertTriangle, Info, BellRing, Sparkles, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    hasPushPermission,
    requestPushPermission,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'urgent') return n.severity === 'urgent';
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="relative">
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notifications & Urgency Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-heading text-xs font-bold text-slate-900 dark:text-white">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Push Permission Action Bar */}
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-indigo-900 dark:text-indigo-200 text-[11px]">
                  {hasPushPermission ? 'Browser Push Alerts Active' : 'Enable Web Push Alerts'}
                </span>
              </div>
              {!hasPushPermission && (
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] transition-colors shadow-xs"
                >
                  Enable 🔔
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 text-[11px] font-semibold">
              <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${
                    filter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${
                    filter === 'urgent'
                      ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${
                    filter === 'unread'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={markAllAsRead}
                  className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Read</span>
                </button>
                <button
                  onClick={clearAll}
                  className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1"
                  title="Clear all"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-1">
                  <p className="text-xs font-semibold">No notifications</p>
                  <p className="text-[11px]">Everything is up to date!</p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const isUrgent = n.severity === 'urgent';
                  const isWarning = n.severity === 'warning';

                  return (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/30 dark:bg-indigo-950/25' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isUrgent
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                            : isWarning
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {isUrgent ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <Info className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {n.title}
                          </h4>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-0.5">
                          {formatDate(n.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
