import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Layers,
} from 'lucide-react';

interface Props {
  students: StudentProfile[];
}

export const StudentManagement: React.FC<Props> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Enriched simulated roster for university overview
  const fullRoster = [
    ...students,
    {
      id: 'stud_4',
      userId: 'usr_student_4',
      phone: '+1 (555) 789-0123',
      college: 'Apex Institute of Technology',
      department: 'Computer Science and Engineering',
      graduationYear: 2026,
      cgpa: 9.42,
      location: 'New York, NY',
      skills: ['Python', 'C++', 'Go', 'Distributed Systems', 'Kubernetes'],
      education: [],
      projects: [],
      experience: [],
      certifications: [],
    },
    {
      id: 'stud_5',
      userId: 'usr_student_5',
      phone: '+1 (555) 890-1234',
      college: 'Apex Institute of Technology',
      department: 'Electronics and Communication',
      graduationYear: 2026,
      cgpa: 8.12,
      location: 'Austin, TX',
      skills: ['Embedded C', 'RTOS', 'Python', 'Verilog', 'IoT'],
      education: [],
      projects: [],
      experience: [],
      certifications: [],
    },
    {
      id: 'stud_6',
      userId: 'usr_student_6',
      phone: '+1 (555) 901-2345',
      college: 'Apex Institute of Technology',
      department: 'Information Technology',
      graduationYear: 2026,
      cgpa: 7.95,
      location: 'Seattle, WA',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
      education: [],
      projects: [],
      experience: [],
      certifications: [],
    },
  ];

  const filtered = fullRoster.filter((s) => {
    const matchesSearch =
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.bio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              University Student Directory (Class of 2026)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify student academic records, GPA thresholds, and placement readiness across all departments.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {filtered.length} Students Listed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by department, skills (e.g. Java, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="ALL">All Engineering Departments</option>
              <option value="Computer Science and Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Communication">Electronics & Communication</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((student, idx) => {
          const isPlaced = idx % 2 === 0;
          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {student.id === 'stud_1'
                      ? 'AJ'
                      : student.id === 'stud_2'
                      ? 'PP'
                      : student.id === 'stud_3'
                      ? 'MW'
                      : student.id === 'stud_4'
                      ? 'RS'
                      : 'ST'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {student.id === 'stud_1'
                        ? 'Alex Johnson'
                        : student.id === 'stud_2'
                        ? 'Priya Patel'
                        : student.id === 'stud_3'
                        ? 'Marcus Williams'
                        : student.id === 'stud_4'
                        ? 'Rohan Singhal'
                        : 'Samantha Taylor'}
                    </h3>
                    <div className="text-xs text-slate-500">{student.department}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{student.cgpa} CGPA</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPlaced
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isPlaced ? '✓ Placed (TechCorp)' : 'Seeking Placement'}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {student.skills.slice(0, 5).map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Batch: {student.graduationYear}</span>
                <span className="text-slate-600 font-medium">{student.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
