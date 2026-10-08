import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PlacementDrive, Job } from '../../types';
import {
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  GraduationCap,
  Users,
  ChevronRight,
  ArrowRight,
  Briefcase,
} from 'lucide-react';

interface Props {
  drives: PlacementDrive[];
  jobs: Job[];
  onDriveUpdated: () => void;
  onNavigateToJob: (jobId: string) => void;
}

export const CampusDrivesView: React.FC<Props> = ({
  drives,
  jobs,
  onDriveUpdated,
  onNavigateToJob,
}) => {
  const { studentProfile } = useAuth();
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const handleRegister = async (driveId: string) => {
    setRegisteringId(driveId);
    try {
      await api.registerForDrive(driveId, studentProfile?.id || 'stud_1');
      onDriveUpdated();
    } catch (e) {
      console.error('Registration failed', e);
    } finally {
      setRegisteringId(null);
    }
  };

  const checkEligibility = (drive: PlacementDrive) => {
    const studentCgpa = studentProfile?.cgpa || 8.92;
    const studentDept = studentProfile?.department || 'Computer Science and Engineering';

    const cgpaOk = studentCgpa >= drive.minCgpa;
    const deptOk =
      drive.allowedDepartments.length === 0 ||
      drive.allowedDepartments.some((d) => d.toLowerCase().includes(studentDept.toLowerCase()) || studentDept.toLowerCase().includes(d.toLowerCase()));

    return {
      isEligible: cgpaOk && deptOk,
      cgpaOk,
      deptOk,
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Official University Schedule</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Campus Placement Drives
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official on-campus and virtual hiring drives arranged by the Career & Placement Cell.
        </p>
      </div>

      {/* Drives List */}
      <div className="space-y-5">
        {drives.map((drive) => {
          const isRegistered = drive.registeredStudentIds.includes(studentProfile?.id || 'stud_1');
          const isShortlisted = drive.shortlistedStudentIds.includes(studentProfile?.id || 'stud_1');
          const { isEligible, cgpaOk, deptOk } = checkEligibility(drive);

          const associatedJobs = jobs.filter((j) => drive.jobIds.includes(j.id));

          return (
            <div
              key={drive.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5"
            >
              {/* Top Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {drive.companyName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        drive.status === 'UPCOMING'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {drive.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{drive.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {drive.description}
                  </p>
                </div>

                {/* Registration Action */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  {isRegistered ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Registered</span>
                      </span>
                      {isShortlisted && (
                        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs">
                          ★ Shortlisted for Round 1
                        </span>
                      )}
                    </div>
                  ) : isEligible ? (
                    <button
                      onClick={() => handleRegister(drive.id)}
                      disabled={registeringId === drive.id}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      <span>{registeringId === drive.id ? 'Registering...' : 'Register for Drive'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 text-slate-400" />
                      <span>Not Eligible</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Criteria & Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Drive Date</span>
                  <strong className="text-slate-800 text-xs sm:text-sm">{drive.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Registration Closes</span>
                  <strong className="text-slate-800 text-xs sm:text-sm">{drive.registrationDeadline}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Min CGPA Cutoff</span>
                  <strong className={`${cgpaOk ? 'text-emerald-700' : 'text-rose-600'} text-xs sm:text-sm`}>
                    {drive.minCgpa} (Your: {studentProfile?.cgpa || 8.92})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Allowed Departments</span>
                  <span className="text-slate-700 font-semibold truncate block">
                    {drive.allowedDepartments.join(', ')}
                  </span>
                </div>
              </div>

              {/* Associated Roles */}
              {associatedJobs.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-700">Openings Recruited in this Drive:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {associatedJobs.map((j) => (
                      <div
                        key={j.id}
                        className="p-3 rounded-xl border border-slate-200/70 bg-white hover:border-blue-300 transition-colors cursor-pointer space-y-1"
                        onClick={() => onNavigateToJob(j.id)}
                      >
                        <div className="font-bold text-xs text-slate-900 truncate">{j.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{j.salary}</span>
                          <span className="text-blue-600 font-semibold flex items-center">
                            View <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
