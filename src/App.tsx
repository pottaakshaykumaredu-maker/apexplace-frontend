import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import {
  Job,
  Application,
  Interview,
  PlacementDrive,
  Company,
  User,
} from './types';

import { Navbar } from './components/common/Navbar';
import { LoginPage } from './components/auth/LoginPage';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { ResumeAIAnalyzer } from './components/student/ResumeAIAnalyzer';
import { JobListings } from './components/student/JobListings';
import { CampusDrivesView } from './components/student/CampusDrivesView';
import { AIInterviewPrep } from './components/student/AIInterviewPrep';
import { AIMockInterviewRoom } from './components/student/AIMockInterviewRoom';
import { AISkillGapRoadmap } from './components/student/AISkillGapRoadmap';
import { ApplicationsTracker } from './components/student/ApplicationsTracker';
import { StudentInterviewsView } from './components/student/StudentInterviewsView';
import { StudentProfileView } from './components/student/StudentProfileView';

// Recruiter Components
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { JobManagement } from './components/recruiter/JobManagement';
import { ApplicantTracker } from './components/recruiter/ApplicantTracker';
import { RecruiterInterviews } from './components/recruiter/RecruiterInterviews';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DriveManagement } from './components/admin/DriveManagement';
import { StudentManagement } from './components/admin/StudentManagement';
import { CompanyManagement } from './components/admin/CompanyManagement';

import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bot,
  Compass,
  Calendar,
  Users,
  Building2,
  Video,
  UserCheck,
  Sparkles,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    role,
    user,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const [selectedJobForPrep, setSelectedJobForPrep] = useState<{
    title: string;
    company: string;
  }>({
    title: 'Software Development Engineer - Backend (Java / Spring)',
    company: 'TechCorp Systems',
  });

  const [highlightAppId, setHighlightAppId] = useState<string | undefined>();

  // =========================================================
  // FETCH PLATFORM DATA
  // =========================================================

  const loadData = async (): Promise<void> => {
    try {
      const [
        jobsData,
        appsData,
        intsData,
        drivesData,
        statsData,
        studentsData,
      ] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getInterviews(),
        api.getDrives(),
        api.getAdminStats(),
        api.getAllStudents(),
      ]);

      setJobs(jobsData);
      setApplications(appsData);
      setInterviews(intsData);
      setDrives(drivesData);

      if (statsData?.companies) {
        setCompanies(statsData.companies);
      }

      setAllStudents(studentsData);
    } catch (error) {
      console.error('Error fetching platform data:', error);
    }
  };

  // =========================================================
  // LOAD DATA ONLY AFTER AUTHENTICATION
  // =========================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void loadData();
  }, [user?.id]);

  // =========================================================
  // DEFAULT TAB BY ROLE
  // =========================================================

  useEffect(() => {
    if (role === 'ROLE_STUDENT') {
      setActiveTab('dashboard');
    } else if (role === 'ROLE_RECRUITER') {
      setActiveTab('recruiter-dashboard');
    } else if (role === 'ROLE_ADMIN') {
      setActiveTab('admin-dashboard');
    }
  }, [role]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigate = (tab: string, meta?: any): void => {
    if (meta?.jobTitle && meta?.company) {
      setSelectedJobForPrep({
        title: meta.jobTitle,
        company: meta.company,
      });
    }

    if (meta?.highlightId) {
      setHighlightAppId(meta.highlightId);
    }

    setActiveTab(tab);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* TOP NAVBAR */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* SUB-NAVIGATION */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
            {/* STUDENT NAVIGATION */}
            {role === 'ROLE_STUDENT' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Jobs & AI Match</span>
                </button>

                <button
                  onClick={() => setActiveTab('resume-ai')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'resume-ai'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ATS Resume Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('mock-interview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'mock-interview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Mock Interview</span>
                </button>

                <button
                  onClick={() => setActiveTab('interview-prep')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'interview-prep'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interview Q&A Pack</span>
                </button>

                <button
                  onClick={() => setActiveTab('skill-gap')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'skill-gap'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Skill Gap Roadmap</span>
                </button>

                <button
                  onClick={() => setActiveTab('drives')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'drives'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Campus Drives</span>
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>My Applications</span>

                  {applications.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 ml-1">
                      {applications.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('interviews')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'interviews'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Interviews</span>

                  {interviews.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 ml-1">
                      {interviews.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Student Profile</span>
                </button>
              </>
            )}

            {/* RECRUITER NAVIGATION */}
            {role === 'ROLE_RECRUITER' && (
              <>
                <button
                  onClick={() => setActiveTab('recruiter-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'recruiter-dashboard'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Recruiter Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('applicants')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'applicants'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>ATS Candidate Tracker</span>

                  {applications.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 ml-1">
                      {applications.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('post-job')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'post-job'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Post & Manage Jobs</span>
                </button>

                <button
                  onClick={() => setActiveTab('recruiter-interviews')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'recruiter-interviews'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Interview Schedule</span>
                </button>

                <button
                  onClick={() => setActiveTab('drives')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'drives'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Campus Drives</span>
                </button>
              </>
            )}

            {/* ADMIN NAVIGATION */}
            {role === 'ROLE_ADMIN' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Placement Statistics</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-drives')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'admin-drives'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Drive Orchestrator</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-students')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'admin-students'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Directory</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-companies')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'admin-companies'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Recruiter Partners</span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    activeTab === 'jobs'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>View All Openings</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STUDENT VIEWS */}
        {role === 'ROLE_STUDENT' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                applications={applications}
                interviews={interviews}
                jobs={jobs}
                drives={drives}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'jobs' && (
              <JobListings
                jobs={jobs}
                applications={applications}
                onApplicationCreated={loadData}
                onNavigateToPrep={(jobTitle, company) =>
                  handleNavigate('interview-prep', {
                    jobTitle,
                    company,
                  })
                }
              />
            )}

            {activeTab === 'resume-ai' && <ResumeAIAnalyzer />}

            {activeTab === 'mock-interview' && (
              <AIMockInterviewRoom
                initialJobTitle={selectedJobForPrep.title}
                initialCompany={selectedJobForPrep.company}
              />
            )}

            {activeTab === 'interview-prep' && (
              <AIInterviewPrep
                initialJobTitle={selectedJobForPrep.title}
                initialCompany={selectedJobForPrep.company}
                onLaunchMockChat={(jobTitle, company) =>
                  handleNavigate('mock-interview', {
                    jobTitle,
                    company,
                  })
                }
              />
            )}

            {activeTab === 'skill-gap' && <AISkillGapRoadmap />}

            {activeTab === 'drives' && (
              <CampusDrivesView
                drives={drives}
                jobs={jobs}
                onDriveUpdated={loadData}
                onNavigateToJob={() => handleNavigate('jobs')}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsTracker
                applications={applications}
                onNavigateToPrep={(jobTitle, company) =>
                  handleNavigate('interview-prep', {
                    jobTitle,
                    company,
                  })
                }
                onNavigateToInterviews={() => handleNavigate('interviews')}
              />
            )}

            {activeTab === 'interviews' && (
              <StudentInterviewsView
                interviews={interviews}
                onNavigateToPrep={(jobTitle, company) =>
                  handleNavigate('interview-prep', {
                    jobTitle,
                    company,
                  })
                }
                onNavigateToMock={(jobTitle, company) =>
                  handleNavigate('mock-interview', {
                    jobTitle,
                    company,
                  })
                }
              />
            )}

            {activeTab === 'profile' && <StudentProfileView />}
          </>
        )}

        {/* RECRUITER VIEWS */}
        {role === 'ROLE_RECRUITER' && (
          <>
            {activeTab === 'recruiter-dashboard' && (
              <RecruiterDashboard
                jobs={jobs}
                applications={applications}
                interviews={interviews}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'applicants' && (
              <ApplicantTracker
                applications={applications}
                jobs={jobs}
                onApplicationUpdated={loadData}
                onInterviewScheduled={loadData}
                highlightAppId={highlightAppId}
              />
            )}

            {activeTab === 'post-job' && (
              <JobManagement
                jobs={jobs}
                onJobCreated={loadData}
                onJobUpdated={loadData}
              />
            )}

            {activeTab === 'recruiter-interviews' && (
              <RecruiterInterviews interviews={interviews} />
            )}

            {activeTab === 'drives' && (
              <CampusDrivesView
                drives={drives}
                jobs={jobs}
                onDriveUpdated={loadData}
                onNavigateToJob={() => handleNavigate('post-job')}
              />
            )}
          </>
        )}

        {/* ADMIN VIEWS */}
        {role === 'ROLE_ADMIN' && (
          <>
            {activeTab === 'admin-dashboard' && (
              <AdminDashboard
                drives={drives}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'admin-drives' && (
              <DriveManagement
                drives={drives}
                jobs={jobs}
                onDriveCreated={loadData}
              />
            )}

            {activeTab === 'admin-students' && (
              <StudentManagement students={allStudents} />
            )}

            {activeTab === 'admin-companies' && (
              <CompanyManagement companies={companies} />
            )}

            {activeTab === 'jobs' && (
              <JobListings
                jobs={jobs}
                applications={applications}
                onApplicationCreated={loadData}
                onNavigateToPrep={(jobTitle, company) =>
                  handleNavigate('interview-prep', {
                    jobTitle,
                    company,
                  })
                }
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              ApexPlace Engine
            </span>
            <span>
              • Digital Campus Recruitment & Placement Automation Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>
              Role-Based Access (Student / Recruiter / Admin)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ===========================================================
// AUTHENTICATED APPLICATION GATE
// ===========================================================

const AuthenticatedApp: React.FC = () => {
  const { user, completeLogin } = useAuth();

  if (!user) {
    return (
      <LoginPage
        onLogin={(authenticatedUser, token) => {
          void completeLogin(
            authenticatedUser as User,
            token
          ).catch((error: unknown) => {
            console.error('Failed to complete login:', error);
          });
        }}
      />
    );
  }

  return <MainApp />;
};

// ===========================================================
// ROOT APP
// ===========================================================

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}