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
        className="relative p-1.5 rounded-[8px] text-[#757575] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
        title="Notifications & Urgency Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#f64932] text-[#ffffff] text-[9px] font-bold flex items-center justify-center border-2 border-[#ffffff]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#ffffff] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
            {/* Header */}
            <div className="p-3.5 bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#0075de]" />
                <h3 className="text-xs font-bold text-[#000000]">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#f64932] text-[#ffffff] text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-[6px] hover:bg-[#f6f5f4] text-[#757575] hover:text-[#000000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Push Permission Action Bar */}
            <div className="p-2.5 bg-[#e6f3fe] border-b border-[#0075de]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#0075de]" />
                <span className="font-semibold text-[#0075de] text-[11px]">
                  {hasPushPermission ? 'Browser Push Active' : 'Enable Web Push Alerts'}
                </span>
              </div>
              {!hasPushPermission && (
                <button
                  type="button"
                  onClick={requestPushPermission}
                  className="px-2.5 py-1 rounded-[6px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] font-medium text-[10px] transition-colors"
                >
                  Enable 🔔
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[rgba(0,0,0,0.06)] bg-[#f6f5f4] text-[11px] font-medium">
              <div className="flex gap-1 p-0.5 bg-[#ffffff] rounded-[6px] border border-[rgba(0,0,0,0.06)]">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded-[4px] transition-all ${
                    filter === 'all' ? 'bg-[#f6f5f4] text-[#000000] font-semibold' : 'text-[#757575]'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2 py-0.5 rounded-[4px] transition-all ${
                    filter === 'urgent' ? 'bg-[#f6f5f4] text-[#f64932] font-semibold' : 'text-[#757575]'
                  }`}
                >
                  Urgent
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2 py-0.5 rounded-[4px] transition-all ${
                    filter === 'unread' ? 'bg-[#f6f5f4] text-[#0075de] font-semibold' : 'text-[#757575]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 rounded-[4px] text-[#757575] hover:text-[#0075de]"
                    title="Mark all read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1 rounded-[4px] text-[#757575] hover:text-[#f64932]"
                    title="Clear history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(0,0,0,0.06)]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#757575]">
                  No notifications in this filter.
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                      !notif.read ? 'bg-[#e6f3fe]/40 hover:bg-[#e6f3fe]/70' : 'hover:bg-[#f6f5f4]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.severity === 'urgent' && (
                        <ShieldAlert className="w-3.5 h-3.5 text-[#f64932]" />
                      )}
                      {notif.severity === 'warning' && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ffb110]" />
                      )}
                      {notif.severity === 'info' && (
                        <Info className="w-3.5 h-3.5 text-[#0075de]" />
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[#000000] truncate">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0075de] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#615d59] leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-[#757575] block pt-0.5">
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
