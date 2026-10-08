import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  Phone,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { user, studentProfile, refreshProfile } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [phone, setPhone] = useState(studentProfile?.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(studentProfile?.location || 'Seattle, WA');
  const [cgpa, setCgpa] = useState(studentProfile?.cgpa || 8.92);
  const [bio, setBio] = useState(
    studentProfile?.bio ||
      'Passionate computer science senior with a strong focus on distributed backend architectures, Spring Boot, MySQL, and modern React interfaces.'
  );
  const [skills, setSkills] = useState<string[]>(
    studentProfile?.skills || ['Java', 'Spring Boot', 'REST APIs', 'MySQL', 'React.js', 'Docker']
  );
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateStudentProfile({
        phone,
        location,
        cgpa: Number(cgpa),
        bio,
        skills,
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save profile', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Batch 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {studentProfile?.department || 'Computer Science and Engineering'} • {studentProfile?.college || 'Apex Institute of Technology'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully in campus records!</span>
        </div>
      )}

      {/* Main Form Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Academic Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Contact & Academic Record</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold mb-1 block">University Email</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-700">
                  {user?.email || 'alex@university.edu'}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  max="10.0"
                  min="0"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Developer Portfolios</span>
            </h3>
            <div className="space-y-2 text-slate-700">
              <a
                href={studentProfile?.githubUrl || 'https://github.com/alex-johnson-dev'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100"
              >
                <span className="font-semibold">GitHub Profile</span>
                <span className="text-slate-400">github.com/alex-johnson-dev</span>
              </a>
              <a
                href={studentProfile?.linkedinUrl || 'https://linkedin.com/in/alex-johnson-swe'}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100"
              >
                <span className="font-semibold">LinkedIn Profile</span>
                <span className="text-slate-400">in/alex-johnson-swe</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Skills & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium leading-relaxed"
            />
          </div>

          {/* Skills Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Technical Skills ({skills.length})</span>
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200/60"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add a new skill (e.g. Kubernetes, Kafka, GraphQL)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 p-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Project Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Key Projects Verified by Department</span>
            </h3>

            <div className="space-y-3">
              {(studentProfile?.projects || []).map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{proj.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{proj.duration}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
