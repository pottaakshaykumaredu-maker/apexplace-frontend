import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Job, Application, Interview } from '../../types';
import {
  Briefcase,
  Users,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface Props {
  jobs: Job[];
  applications: Application[];
  interviews: Interview[];
  onNavigate: (tab: string, meta?: any) => void;
}

export const RecruiterDashboard: React.FC<Props> = ({
  jobs,
  applications,
  interviews,
  onNavigate,
}) => {
  const { user } = useAuth();

  const activeJobs = jobs.filter((j) => j.status === 'ACTIVE');
  const totalApplicants = applications.length;
  const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED');
  const interviewStage = applications.filter((a) => a.status === 'INTERVIEW');
  const offersExtended = applications.filter((a) => a.status === 'SELECTED');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10">
              <Briefcase className="w-3.5 h-3.5 text-purple-300" />
              <span>TechCorp Systems University Hiring Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruitment Dashboard — {user?.name || 'Sarah Chen'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Apex Institute of Technology Class of 2026 talent portal. Screen high-matching campus candidates, schedule technical rounds, and coordinate university drive listings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('post-job')}
              className="px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Campus Job</span>
            </button>
            <button
              onClick={() => onNavigate('applicants')}
              className="px-4 py-2.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-purple-200" />
              <span>Review Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeJobs.length}</div>
            <div className="text-xs font-semibold text-slate-500">Active Job Postings</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalApplicants}</div>
            <div className="text-xs font-semibold text-slate-500">Total Applicants</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{interviewStage.length}</div>
            <div className="text-xs font-semibold text-slate-500">In Interview Stage</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{offersExtended.length}</div>
            <div className="text-xs font-semibold text-slate-500">Offers Extended</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Postings & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Applicants Requiring Review */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Submissions</h2>
              <p className="text-xs text-slate-500">Sorted by AI Match score and qualification threshold</p>
            </div>
            <button
              onClick={() => onNavigate('applicants')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Manage ATS ({applications.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{app.studentName}</span>
                    <span className="text-xs text-slate-400 font-medium">({app.studentDepartment})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      CGPA {app.studentCgpa}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Applying for: <strong className="text-slate-800">{app.jobTitle}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {app.matchScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{app.matchScore}% Match</span>
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'INTERVIEW'
                        ? 'bg-purple-100 text-purple-800'
                        : app.status === 'SHORTLISTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                  <button
                    onClick={() => onNavigate('applicants', { highlightId: app.id })}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Jobs Posted & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Your Active Job Listings</h3>
              <button
                onClick={() => onNavigate('post-job')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </button>
            </div>

            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                      {job.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{job.salary}</span>
                    <span>{job.applicantsCount || 0} applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Quick Tools */}
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-md space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>AI Screening Assistant</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini automatically scores and parses candidate resumes against your job descriptions, highlighting matching tech keywords and suggesting targeted interview questions.
            </p>
            <button
              onClick={() => onNavigate('applicants')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Open ATS Candidate Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
