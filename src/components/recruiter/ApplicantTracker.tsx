import React, { useState } from 'react';
import { api } from '../../services/api';
import { Application, Job, StudentProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Award,
  Video,
  FileText,
  Mail,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

interface Props {
  applications: Application[];
  jobs: Job[];
  onApplicationUpdated: () => void;
  onInterviewScheduled: () => void;
  highlightAppId?: string;
}

export const ApplicantTracker: React.FC<Props> = ({
  applications,
  jobs,
  onApplicationUpdated,
  onInterviewScheduled,
  highlightAppId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Schedule Interview Modal
  const [schedulingApp, setSchedulingApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-10-12');
  const [interviewTime, setInterviewTime] = useState('11:00 - 12:00 EST');
  const [interviewType, setInterviewType] = useState<any>('Technical');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/ais-recruiter-round1');
  const [notes, setNotes] = useState('Spring Boot architecture, MySQL query optimization, and algorithmic coding.');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      onApplicationUpdated();
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingApp) return;
    setSubmittingSchedule(true);

    try {
      await api.scheduleInterview({
        applicationId: schedulingApp.id,
        jobId: schedulingApp.jobId,
        studentId: schedulingApp.studentId,
        studentName: schedulingApp.studentName,
        jobTitle: schedulingApp.jobTitle,
        companyName: schedulingApp.companyName,
        interviewDate,
        interviewTime,
        interviewType,
        meetingLink,
        notes,
        status: 'SCHEDULED',
      });
      onInterviewScheduled();
      onApplicationUpdated();
      setSchedulingApp(null);
    } catch (e) {
      console.error('Failed to schedule interview', e);
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Applicant Tracking System (ATS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review candidates, inspect AI resume match scores, shortlist, and invite to technical interviews.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {filteredApps.length} Candidates Loaded
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, role, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-medium"
            >
              <option value="ALL">All Job Openings</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-medium"
            >
              <option value="ALL">All Application Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No candidates matched your filter criteria.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-2xl border transition-all p-6 space-y-4 ${
                highlightAppId === app.id
                  ? 'border-purple-500 ring-2 ring-purple-100'
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                    <span className="text-xs text-slate-400 font-medium">({app.studentEmail})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700">
                      CGPA {app.studentCgpa}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    Applied for: <strong className="text-slate-900">{app.jobTitle}</strong> • {app.studentCollege} ({app.studentDepartment})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Submission date: {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {app.matchScore && (
                    <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{app.matchScore}% Match</span>
                    </div>
                  )}

                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      app.status === 'SELECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'INTERVIEW'
                        ? 'bg-purple-100 text-purple-800'
                        : app.status === 'SHORTLISTED'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {app.coverNote && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-800 block mb-0.5">Candidate Cover Note:</strong>
                  "{app.coverNote}"
                </div>
              )}

              {/* Status Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Resume on file: <strong>{app.resumeUrl || 'Candidate_Resume.pdf'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {app.status !== 'SHORTLISTED' && app.status !== 'INTERVIEW' && app.status !== 'SELECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors"
                    >
                      Shortlist
                    </button>
                  )}

                  {app.status !== 'INTERVIEW' && (
                    <button
                      onClick={() => setSchedulingApp(app)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Interview</span>
                    </button>
                  )}

                  {app.status !== 'SELECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors"
                    >
                      Select / Extend Offer
                    </button>
                  )}

                  {app.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-600 font-bold hover:bg-rose-50 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Interview Modal */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Interview Scheduler
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Invite {schedulingApp.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Role: {schedulingApp.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setSchedulingApp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Window</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Interview Round Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Technical">Technical Round (Coding & Architecture)</option>
                  <option value="HR">HR & Cultural Alignment</option>
                  <option value="Final">Final Partner Interview</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Link (Google Meet)</label>
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Preparation Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSchedule}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>{submittingSchedule ? 'Sending...' : 'Schedule & Notify Candidate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
