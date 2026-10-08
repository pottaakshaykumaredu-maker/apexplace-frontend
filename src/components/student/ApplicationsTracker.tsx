import React, { useState } from 'react';
import { Application } from '../../types';
import {
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Video,
  AlertCircle,
} from 'lucide-react';

interface Props {
  applications: Application[];
  onNavigateToPrep: (jobTitle: string, company: string) => void;
  onNavigateToInterviews: () => void;
}

export const ApplicationsTracker: React.FC<Props> = ({
  applications,
  onNavigateToPrep,
  onNavigateToInterviews,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredApps = applications.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            🎉 Offer Extended
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Interview Scheduled
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Shortlisted
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Applied
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-time Status Tracking</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              My Job Applications ({applications.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track progression from application submission to interview rounds and final offer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['ALL', 'INTERVIEW', 'SHORTLISTED', 'UNDER_REVIEW', 'APPLIED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Applications' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No applications match this filter status.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {app.companyName}
                    </span>
                    {getStatusBadge(app.status)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                  <div className="text-xs text-slate-500">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()} • Attached Resume:{' '}
                    <span className="font-semibold text-slate-700">{app.resumeUrl || 'Alex_Johnson_Resume.pdf'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {app.matchScore && (
                    <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{app.matchScore}% Match</span>
                    </div>
                  )}

                  {app.status === 'INTERVIEW' ? (
                    <button
                      onClick={onNavigateToInterviews}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>View Interview Invite</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToPrep(app.jobTitle, app.companyName)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Prep</span>
                    </button>
                  )}
                </div>
              </div>

              {app.coverNote && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 italic border border-slate-100">
                  "{app.coverNote}"
                </div>
              )}

              {/* Visual Pipeline Progression Tracker */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                  <div
                    className={`py-1.5 rounded-lg border ${
                      ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].includes(app.status)
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    1. Submitted
                  </div>
                  <div
                    className={`py-1.5 rounded-lg border ${
                      ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'].includes(app.status)
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    2. Under Review
                  </div>
                  <div
                    className={`py-1.5 rounded-lg border ${
                      ['SHORTLISTED', 'INTERVIEW', 'SELECTED'].includes(app.status)
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    3. Shortlisted
                  </div>
                  <div
                    className={`py-1.5 rounded-lg border ${
                      ['INTERVIEW', 'SELECTED'].includes(app.status)
                        ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    4. Interview
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
