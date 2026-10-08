import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Job, JobMatchResult, Application } from '../../types';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Send,
  Building2,
  DollarSign,
  GraduationCap,
} from 'lucide-react';

interface Props {
  jobs: Job[];
  applications: Application[];
  onApplicationCreated: () => void;
  onNavigateToPrep: (jobTitle: string, company: string) => void;
}

export const JobListings: React.FC<Props> = ({
  jobs,
  applications,
  onApplicationCreated,
  onNavigateToPrep,
}) => {
  const { studentProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal States
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // AI Match Dialog
  const [matchModalJob, setMatchModalJob] = useState<Job | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchingAi, setMatchingAi] = useState(false);

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'ALL' || j.jobType === selectedType;
    return matchesSearch && matchesType;
  });

  const isApplied = (jobId: string) => applications.some((a) => a.jobId === jobId);

  const handleApply = async () => {
    if (!applyJob || !studentProfile) return;
    setApplying(true);
    try {
      await api.applyToJob(applyJob.id, studentProfile.id, coverNote);
      setAppliedSuccess(true);
      onApplicationCreated();
      setTimeout(() => {
        setAppliedSuccess(false);
        setApplyJob(null);
        setCoverNote('');
      }, 1500);
    } catch (e) {
      console.error('Error applying to job', e);
    } finally {
      setApplying(false);
    }
  };

  const handleRunAiMatch = async (job: Job) => {
    setMatchModalJob(job);
    setMatchingAi(true);
    try {
      const res = await api.matchJob(studentProfile?.id || 'stud_1', job.id);
      setMatchResult(res);
    } catch (e) {
      console.error('Match error', e);
    } finally {
      setMatchingAi(false);
    }
  };

  const computeQuickScore = (job: Job) => {
    if (job.id === 'job_1') return 92;
    if (job.id === 'job_2') return 87;
    if (job.id === 'job_4') return 78;
    if (job.id === 'job_5') return 85;
    return 74;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Campus & Partner Job Openings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified opportunities from approved university recruiters with instant AI fit check.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredJobs.length} openings
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. Java, Spring, React)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex gap-2">
            {(['ALL', 'Full Time', 'Internship'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          const applied = isApplied(job.id);
          const score = computeQuickScore(job);

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Company & Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg flex-shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{job.title}</h3>
                      <div className="text-xs text-slate-500 font-medium">{job.companyName}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunAiMatch(job)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 text-xs font-bold transition-colors flex-shrink-0"
                    title="Click for Gemini Match Diagnostic"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{score}% Match</span>
                  </button>
                </div>

                {/* Details Pills */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{job.salary}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.eligibility}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunAiMatch(job)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Breakdown</span>
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => onNavigateToPrep(job.title, job.companyName)}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                  >
                    Interview Prep
                  </button>
                </div>

                {applied ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setApplyJob(job)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Quick Apply Dialog */}
      {applyJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Campus Application
                </span>
                <h3 className="text-lg font-bold text-slate-900">{applyJob.title}</h3>
                <p className="text-xs text-slate-500">{applyJob.companyName} • {applyJob.location}</p>
              </div>
              <button
                onClick={() => setApplyJob(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Profile Snapshot */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
              <div className="font-bold text-slate-700">Applicant Summary</div>
              <div className="text-slate-600">
                <strong>Name:</strong> {studentProfile?.bio ? 'Alex Johnson' : 'Alex Johnson'} ({studentProfile?.department})
              </div>
              <div className="text-slate-600">
                <strong>Current CGPA:</strong> {studentProfile?.cgpa || 8.92} / 10.0
              </div>
              <div className="text-slate-600">
                <strong>Attached Resume:</strong> {studentProfile?.resumeFileName || 'Alex_Johnson_Resume.pdf'}
              </div>
            </div>

            {/* Cover Note Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Brief Cover Note to Recruiter (Optional)
              </label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Highlight your relevant projects, internship achievements, or eagerness for this position..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {appliedSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application submitted successfully!</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setApplyJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{applying ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: AI Match Diagnostics */}
      {matchModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">AI Job Match Diagnostics</h3>
                  <p className="text-xs text-slate-500">
                    {matchModalJob.title} at {matchModalJob.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMatchModalJob(null);
                  setMatchResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {matchingAi ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-semibold">
                  Comparing your resume with role specifications using Gemini...
                </p>
              </div>
            ) : matchResult ? (
              <div className="space-y-4">
                {/* Score Header */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                      Overall Alignment
                    </div>
                    <div className="text-3xl font-black text-blue-900">
                      {matchResult.matchPercentage}%
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-600 max-w-xs font-medium">
                    {matchResult.matchPercentage >= 80
                      ? 'High probability of clearing initial recruiter resume screening.'
                      : 'Moderate fit. Consider preparing for targeted skill gaps.'}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed font-medium">
                  {matchResult.explanation}
                </div>

                {/* Matching vs Missing Skills */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Matching Competencies</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.matchingSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Missing / Desired</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white text-amber-800 text-[11px] font-semibold border border-amber-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900">Recommended Steps Before Applying:</div>
                  <div className="space-y-1.5">
                    {matchResult.recommendedActions.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      const job = matchModalJob;
                      setMatchModalJob(null);
                      onNavigateToPrep(job.title, job.companyName);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Interview Prep</span>
                  </button>
                  <button
                    onClick={() => {
                      const job = matchModalJob;
                      setMatchModalJob(null);
                      setApplyJob(job);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Proceed to Apply
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
