import React from 'react';
import { Interview } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Sparkles,
  Building2,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface Props {
  interviews: Interview[];
  onNavigateToPrep: (jobTitle: string, company: string) => void;
  onNavigateToMock: (jobTitle: string, company: string) => void;
}

export const StudentInterviewsView: React.FC<Props> = ({
  interviews,
  onNavigateToPrep,
  onNavigateToMock,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          <span>Scheduled University Rounds</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          My Scheduled Interviews ({interviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Join Google Meet virtual rooms, review recruiter instructions, and launch customized AI interview practice.
        </p>
      </div>

      <div className="space-y-4">
        {interviews.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No scheduled interviews currently. Keep applying to active campus openings!
          </div>
        ) : (
          interviews.map((int) => (
            <div
              key={int.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 hover:border-purple-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                      {int.companyName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      {int.interviewType} Round
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{int.jobTitle}</h3>
                  <div className="text-xs text-slate-500">
                    Candidate: <strong className="text-slate-700">{int.studentName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={int.meetingLink || 'https://meet.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Google Meet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Schedule Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Date</span>
                    <strong className="text-slate-800">{int.interviewDate}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Time Slot</span>
                    <strong className="text-slate-800">{int.interviewTime}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-slate-400 block font-medium">Platform</span>
                    <strong className="text-slate-800">{int.location || 'Google Meet'}</strong>
                  </div>
                </div>
              </div>

              {/* Recruiter Notes */}
              {int.notes && (
                <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-purple-900 block">
                    Preparation Focus & Notes from Recruiter:
                  </span>
                  <p className="leading-relaxed font-medium">{int.notes}</p>
                </div>
              )}

              {/* Actions Bottom Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Recommendation: Review concurrency & database isolation levels before this round.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToPrep(int.jobTitle, int.companyName)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Generate Q&A Prep Pack</span>
                  </button>
                  <button
                    onClick={() => onNavigateToMock(int.jobTitle, int.companyName)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>AI Mock Practice</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
