import React from 'react';
import { Interview } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Users,
  CheckCircle2,
  Building2,
} from 'lucide-react';

interface Props {
  interviews: Interview[];
}

export const RecruiterInterviews: React.FC<Props> = ({ interviews }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          <span>Interviewer Calendar</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Scheduled Candidate Interviews ({interviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upcoming video evaluation sessions with shortlisted students from Apex Institute.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No interviews scheduled currently. Shortlist candidates from the ATS tab to schedule rounds.
          </div>
        ) : (
          interviews.map((int) => (
            <div
              key={int.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      {int.interviewType} Interview
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Candidate: {int.studentName}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Position: <strong className="text-slate-700">{int.jobTitle}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={int.meetingLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Scheduled Date</span>
                  <strong className="text-slate-800">{int.interviewDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Time Window</span>
                  <strong className="text-slate-800">{int.interviewTime}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Interview Chamber</span>
                  <strong className="text-slate-800">{int.location || 'Google Meet Virtual'}</strong>
                </div>
              </div>

              {int.notes && (
                <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700">
                  <strong className="text-purple-900 block mb-0.5">Evaluation Agenda:</strong>
                  {int.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
