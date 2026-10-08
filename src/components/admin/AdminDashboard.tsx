import React from 'react';
import { PlacementDrive, Company } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  drives: PlacementDrive[];
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ drives, onNavigate }) => {
  const departmentStats = [
    { name: 'Computer Science and Engineering', total: 60, placed: 54, percentage: 90, avgCgpa: 8.5 },
    { name: 'Information Technology', total: 45, placed: 40, percentage: 88, avgCgpa: 8.2 },
    { name: 'Electronics and Communication', total: 35, placed: 24, percentage: 68, avgCgpa: 7.9 },
    { name: 'Mechanical and Automation', total: 15, placed: 10, percentage: 66, avgCgpa: 7.6 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Campus Career & Placement Cell (Admin Console)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Placement Dean Portal — Dr. Rajesh Sharma
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Apex Institute of Technology Placement Season 2026. Real-time university statistics, drive scheduling, company relationships, and student verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-drives')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Campus Drive</span>
            </button>
            <button
              onClick={() => onNavigate('admin-students')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-400/40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-emerald-200" />
              <span>Student Roster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">83.4%</div>
            <div className="text-xs font-semibold text-slate-500">Overall Placement Rate</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹45.0 LPA</div>
            <div className="text-xs font-semibold text-slate-500">Highest Package Offered</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">38</div>
            <div className="text-xs font-semibold text-slate-500">Recruiting Companies</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">128 / 155</div>
            <div className="text-xs font-semibold text-slate-500">Students Placed</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Placement Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Department-wise Placement Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Class of 2026 B.Tech placement percentages & conversion metrics
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Avg CTC: ₹14.2 LPA
            </span>
          </div>

          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{dept.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">Avg CGPA: {dept.avgCgpa}</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">
                      {dept.placed} / {dept.total} ({dept.percentage}%)
                    </strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Campus Drive Overseer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Active Campus Drives</h3>
              <button
                onClick={() => onNavigate('admin-drives')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-3">
              {drives.map((d) => (
                <div key={d.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{d.companyName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {d.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{d.title}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Registered Students: <strong className="text-slate-700">{d.registeredStudentIds.length}</strong> • Min CGPA: {d.minCgpa}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('admin-drives')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Create Placement Drive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
