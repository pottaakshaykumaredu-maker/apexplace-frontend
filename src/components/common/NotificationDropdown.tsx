import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Briefcase, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export const NotificationDropdown: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, unreadCount, markNotificationRead } = useAuth();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_JOB':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'INTERVIEW_SCHEDULED':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'SHORTLISTED':
      case 'SELECTION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'AI_RECOMMENDATION':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-sm text-slate-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Close
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl && onNavigate) {
                  if (notif.actionUrl.includes('applications')) onNavigate('applications');
                  else if (notif.actionUrl.includes('interviews')) onNavigate('interviews');
                  else if (notif.actionUrl.includes('drives')) onNavigate('drives');
                  else if (notif.actionUrl.includes('jobs')) onNavigate('jobs');
                  else if (notif.actionUrl.includes('applicants')) onNavigate('applicants');
                }
                onClose();
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/90 transition-colors cursor-pointer text-left ${
                notif.status === 'UNREAD' ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100/80 flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${notif.status === 'UNREAD' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {notif.status === 'UNREAD' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 bg-slate-50/60 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Automated Campus Recruitment System Real-time Feeds
        </span>
      </div>
    </div>
  );
};
