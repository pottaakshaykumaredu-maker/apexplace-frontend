import React, { useState } from 'react';
import { api } from '../../services/api';
import { PlacementDrive, Job } from '../../types';
import {
  Calendar,
  Plus,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface Props {
  drives: PlacementDrive[];
  jobs: Job[];
  onDriveCreated: () => void;
}

export const DriveManagement: React.FC<Props> = ({ drives, jobs, onDriveCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('Google Cloud / Enterprise');
  const [date, setDate] = useState('2026-11-10');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-10-30');
  const [minCgpa, setMinCgpa] = useState(8.0);
  const [departments, setDepartments] = useState('Computer Science and Engineering, Information Technology');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);

    try {
      await api.createDrive({
        companyId: `comp_${Date.now()}`,
        companyName,
        title,
        date,
        registrationDeadline,
        minCgpa: Number(minCgpa),
        allowedDepartments: departments.split(',').map((d) => d.trim()).filter(Boolean),
        graduationYear: 2026,
        jobIds: jobs.slice(0, 2).map((j) => j.id),
        description,
      });
      onDriveCreated();
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (e) {
      console.error('Failed to create drive', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Placement Drive Orchestration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, schedule, and configure university placement drives and eligibility criteria.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Announce New Drive</span>
        </button>
      </div>

      {/* Drives Grid */}
      <div className="space-y-4">
        {drives.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    {d.companyName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    {d.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{d.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{d.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center flex-shrink-0">
                <div className="text-xl font-black text-slate-900">
                  {d.registeredStudentIds.length}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Registered Students</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Drive Date</span>
                <strong className="text-slate-800">{d.date}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Reg Deadline</span>
                <strong className="text-slate-800">{d.registrationDeadline}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Cutoff CGPA</span>
                <strong className="text-emerald-700">{d.minCgpa}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Allowed Branches</span>
                <span className="text-slate-700 font-semibold truncate block">
                  {d.allowedDepartments.join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Campus Drive Coordinator
                </span>
                <h3 className="text-lg font-bold text-slate-900">Schedule University Drive</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Drive Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud Campus Recruitment Drive 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Partner</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Drive Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration Closes</label>
                  <input
                    type="date"
                    required
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Allowed Departments (Comma separated)
                </label>
                <input
                  type="text"
                  value={departments}
                  onChange={(e) => setDepartments(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Drive Description & Process</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the hiring rounds (Online Assessment, Technical Interview, HR Round)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {submitting ? 'Publishing...' : 'Announce Campus Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
