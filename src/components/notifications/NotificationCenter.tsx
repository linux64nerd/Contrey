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
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Notifications & Urgency Center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-extrabold tracking-wide">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-black">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Push Permission Action Bar */}
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-950">
                  {hasPushPermission ? 'Push Alerts Enabled' : 'Browser Push Alerts'}
                </span>
              </div>
              {!hasPushPermission && (
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                >
                  Enable 🔔
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold">
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded-md ${
                    filter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2 py-0.5 rounded-md ${
                    filter === 'urgent' ? 'bg-white text-rose-600 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2 py-0.5 rounded-md ${
                    filter === 'unread' ? 'bg-white text-emerald-600 shadow-xs font-bold' : 'text-slate-500'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 rounded text-slate-400 hover:text-emerald-700"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                    title="Clear history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No notifications in this filter.
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.read ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.severity === 'urgent' && (
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                      )}
                      {notif.severity === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {notif.severity === 'info' && (
                        <Info className="w-4 h-4 text-sky-500" />
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {formatDate(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
