export type UserRole = 'ROLE_STUDENT' | 'ROLE_RECRUITER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  cgpaOrPercentage: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  duration?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  college: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  location: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  resumeText?: string;
  resumeAnalysis?: ResumeAnalysisResult;
}

export interface ResumeAnalysisResult {
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  certifications: string[];
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  overallScore?: number;
  summary?: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  logo?: string;
  createdAt: string;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyId: string;
  position: string;
  company?: Company;
}

export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Contract';
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  location: string;
  jobType: JobType;
  experience: string;
  education: string;
  eligibility: string;
  deadline: string;
  status: JobStatus;
  createdAt: string;
  applicantsCount?: number;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentDepartment: string;
  studentCgpa: number;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  coverNote?: string;
  matchScore?: number;
  resumeUrl?: string;
  interviewId?: string;
}

export type InterviewType = 'Online' | 'Offline' | 'Technical' | 'HR' | 'Final';
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  studentId: string;
  studentName: string;
  jobTitle: string;
  companyName: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
  meetingLink?: string;
  location?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  date: string;
  registrationDeadline: string;
  minCgpa: number;
  allowedDepartments: string[];
  graduationYear: number;
  jobIds: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  registeredStudentIds: string[];
  shortlistedStudentIds: string[];
  selectedStudentIds: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  type:
    | 'NEW_JOB'
    | 'APPLICATION_SUBMITTED'
    | 'STATUS_CHANGED'
    | 'SHORTLISTED'
    | 'INTERVIEW_SCHEDULED'
    | 'SELECTION'
    | 'REJECTION'
    | 'PLACEMENT_DRIVE'
    | 'AI_RECOMMENDATION';
  status: 'UNREAD' | 'READ';
  createdAt: string;
  actionUrl?: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  explanation: string;
  recommendedActions: string[];
  isDemo?: boolean;
}

export interface SkillGapResult {
  currentSkills: string[];
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  prioritySkills: string[];
  suggestedLearningTopics: string[];
  roadmap: { step: number; title: string; description: string; duration: string }[];
  isDemo?: boolean;
}

export interface InterviewPrepQuestion {
  question: string;
  suggestedAnswer: string;
  explanation: string;
  followUpQuestions: string[];
  importantTopics: string[];
}

export interface InterviewPrepResult {
  interviewType: string;
  difficulty: string;
  questions: InterviewPrepQuestion[];
  preparationTips: string[];
  isDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
