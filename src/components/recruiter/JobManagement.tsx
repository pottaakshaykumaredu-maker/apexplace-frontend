import React, { useState } from 'react';
import { api } from '../../services/api';
import { Job, JobType } from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  DollarSign,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface Props {
  jobs: Job[];
  onJobCreated: () => void;
  onJobUpdated: () => void;
}

export const JobManagement: React.FC<Props> = ({ jobs, onJobCreated, onJobUpdated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('TechCorp Systems');
  const [location, setLocation] = useState('San Francisco, CA / Hybrid');
  const [jobType, setJobType] = useState<JobType>('Full Time');
  const [salary, setSalary] = useState('₹18-24 LPA (or $105,000/yr)');
  const [eligibility, setEligibility] = useState('CGPA 7.5+ with no backlogs');
  const [experience, setExperience] = useState('Fresher / 0-1 Years');
  const [education, setEducation] = useState('B.Tech / B.E. in CS / IT / Related Fields');
  const [skills, setSkills] = useState('Java, Spring Boot, MySQL, REST APIs, Git, Docker');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-11-30');

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);

    try {
      await api.createJob({
        companyId: 'comp_1',
        companyName,
        title,
        location,
        jobType,
        salary,
        eligibility,
        experience,
        education,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        description,
        deadline,
        status: 'ACTIVE',
      });
      onJobCreated();
      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Job creation failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (job: Job) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.updateJobStatus(job.id, newStatus);
      onJobUpdated();
    } catch (e) {
      console.error('Status toggle failed', e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Campus Job Listings Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish, edit, and manage university campus recruitment roles for Apex Institute students.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Job</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                    {job.companyName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    job.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="p-1.5 px-2.5 rounded-lg bg-slate-50 font-medium">
                  {job.jobType}
                </span>
                <span className="p-1.5 px-2.5 rounded-lg bg-slate-50 font-medium">
                  {job.location}
                </span>
                <span className="p-1.5 px-2.5 rounded-lg bg-slate-50 font-bold text-slate-800">
                  {job.salary}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Applicants: <strong className="text-slate-900">{job.applicantsCount || 0}</strong> • Deadline: {job.deadline}
              </span>
              <button
                onClick={() => handleToggleStatus(job)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  job.status === 'ACTIVE'
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {job.status === 'ACTIVE' ? 'Close Job' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  TechCorp Systems Hiring
                </span>
                <h3 className="text-lg font-bold text-slate-900">Post New Campus Job</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE - 1 (Backend & Microservices)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compensation / CTC</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Mode</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Description & Responsibilities *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the technical responsibilities, team structure, and qualifications expected..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold"
                >
                  {submitting ? 'Publishing...' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
