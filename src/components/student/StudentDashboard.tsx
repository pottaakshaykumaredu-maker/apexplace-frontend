import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, Interview, Job, PlacementDrive } from '../../types';
import {
  FileText,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Props {
  applications: Application[];
  interviews: Interview[];
  jobs: Job[];
  drives: PlacementDrive[];
  onNavigate: (tab: string, metadata?: any) => void;
}

export const StudentDashboard: React.FC<Props> = ({
  applications,
  interviews,
  jobs,
  drives,
  onNavigate,
}) => {
  const { user, studentProfile } = useAuth();

  const totalApplied = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW' || a.status === 'SELECTED'
  ).length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'SCHEDULED');
  const upcomingDriveCount = drives.length;
  const atsScore = studentProfile?.resumeAnalysis?.overallScore || 88;

  const nextInterview = scheduledInterviews[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Apex Placement Season 2026 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex'}!
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Your profile is matched with <strong className="text-white">{jobs.length} campus openings</strong>. Your current AI ATS profile score is{' '}
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                {atsScore}/100
              </span>
              . Prepare for your upcoming rounds with interactive AI mock interviews.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => onNavigate('resume-ai')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>AI Resume Check</span>
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalApplied}</div>
            <div className="text-xs font-semibold text-slate-500">Active Applications</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{shortlisted}</div>
            <div className="text-xs font-semibold text-slate-500">Shortlisted / Progressed</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{scheduledInterviews.length}</div>
            <div className="text-xs font-semibold text-slate-500">Upcoming Interviews</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{upcomingDriveCount}</div>
            <div className="text-xs font-semibold text-slate-500">Placement Drives</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recommended Openings & Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Scheduled Interview Spotlight */}
          {nextInterview && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 flex-shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                    Scheduled Technical Round
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{nextInterview.jobTitle}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {nextInterview.companyName} • {nextInterview.interviewDate} at {nextInterview.interviewTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={nextInterview.meetingLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Meet</span>
                </a>
                <button
                  onClick={() => onNavigate('interview-prep', { jobTitle: nextInterview.jobTitle, company: nextInterview.companyName })}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Prep Pack</span>
                </button>
              </div>
            </div>
          )}

          {/* High Match Jobs for You */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recommended Jobs with AI Match</h2>
                <p className="text-xs text-slate-500">Based on your skills: Java, Spring Boot, MySQL, React</p>
              </div>
              <button
                onClick={() => onNavigate('jobs')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All ({jobs.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{job.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {job.jobType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {job.companyName} • {job.location} • <strong className="text-slate-900">{job.salary}</strong>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.slice(0, 4).map((sk) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{job.id === 'job_1' ? '92%' : job.id === 'job_2' ? '87%' : '78%'} Fit</span>
                    </div>
                    <button
                      onClick={() => onNavigate('jobs')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications Pipeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Application Pipeline Status</h2>
                <p className="text-xs text-slate-500">Track stage updates from campus recruiters</p>
              </div>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Pipeline</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{app.jobTitle}</h4>
                    <p className="text-xs text-slate-500">
                      {app.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'INTERVIEW'
                          ? 'bg-purple-100 text-purple-800'
                          : app.status === 'SHORTLISTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'APPLIED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <button
                      onClick={() => onNavigate('applications')}
                      className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Career Tools & Campus Drives */}
        <div className="space-y-6">
          {/* AI Placement Tools Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">AI Placement Suite</h3>
                <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('resume-ai')}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    ATS Resume Scanner
                  </div>
                  <div className="text-[11px] text-slate-400">Identify missing skills & score 88/100</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('mock-interview')}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    AI Mock Interviewer
                  </div>
                  <div className="text-[11px] text-slate-400">Simulate Spring Boot & DSA technical round</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('skill-gap')}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    Skill Gap & Learning Roadmap
                  </div>
                  <div className="text-[11px] text-slate-400">Kafka, Kubernetes & distributed systems path</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('interview-prep')}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    Role-Specific Question Generator
                  </div>
                  <div className="text-[11px] text-slate-400">Instant model answers & follow-ups</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Upcoming Placement Drives */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Campus Drives</h3>
              <button
                onClick={() => onNavigate('drives')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                All Drives
              </button>
            </div>

            <div className="space-y-3">
              {drives.map((d) => {
                const isRegistered = d.registeredStudentIds.includes('stud_1');
                return (
                  <div key={d.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{d.companyName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Drive Date: {d.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{d.title}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">Min CGPA: {d.minCgpa}</span>
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registered</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onNavigate('drives')}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
