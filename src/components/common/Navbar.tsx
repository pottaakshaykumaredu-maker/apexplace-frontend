import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Bell,
  Sparkles,
  LogOut,
  ChevronDown,
  Download,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const { user, role, loginAs, unreadCount, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'ROLE_STUDENT':
        return 'Student';
      case 'ROLE_RECRUITER':
        return 'Recruiter (TechCorp)';
      case 'ROLE_ADMIN':
        return 'Placement Dean (Admin)';
    }
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'ROLE_STUDENT':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'ROLE_RECRUITER':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'ROLE_ADMIN':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
                ApexPlace
              </span>

              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                AI Powered
              </span>
            </div>

            <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
              Campus Placement & Smart Career Orchestration
            </p>
          </div>
        </div>

        {/* Center: Persona Switcher */}
        <div className="hidden md:flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">

          <button
            onClick={() => loginAs('ROLE_STUDENT')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              role === 'ROLE_STUDENT'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => loginAs('ROLE_RECRUITER')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              role === 'ROLE_RECRUITER'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>

          <button
            onClick={() => loginAs('ROLE_ADMIN')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              role === 'ROLE_ADMIN'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Placement Officer</span>
          </button>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">

          {/* Mobile Role Switch Button */}
          <div className="md:hidden relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
            >
              {getRoleIcon(role)}

              <span>
                {role === 'ROLE_STUDENT'
                  ? 'Student'
                  : role === 'ROLE_RECRUITER'
                    ? 'Recruiter'
                    : 'Admin'}
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">

                <button
                  onClick={() => {
                    loginAs('ROLE_STUDENT');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Alex (Student)
                </button>

                <button
                  onClick={() => {
                    loginAs('ROLE_RECRUITER');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Sarah (Recruiter)
                </button>

                <button
                  onClick={() => {
                    loginAs('ROLE_ADMIN');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Dr. Sharma (Admin)
                </button>

              </div>
            )}
          </div>

          {/* Download Project Source */}
          <a
            href="/api/download-project"
            download="placement-platform-full-project.tar.gz"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            title="Download complete backend & frontend source archive"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Code</span>
          </a>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          </div>

          {/* User Profile + Logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>

              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || 'User'}
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  {getRoleLabel(role)}
                </div>
              </div>
            </div>

            {/* LOG OUT */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};