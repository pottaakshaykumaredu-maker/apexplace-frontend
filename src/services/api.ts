import {
  User,
  StudentProfile,
  Job,
  Application,
  Interview,
  PlacementDrive,
  NotificationItem,
  ResumeAnalysisResult,
  JobMatchResult,
  SkillGapResult,
  InterviewPrepResult,
} from '../types';

// =========================================================
// BASE BACKEND URL
// =========================================================
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://ai-backend-production-38bd.up.railway.app';

// =========================================================
// ERROR HANDLING
// =========================================================

const getErrorMessage = async (
  response: Response,
  fallback: string
): Promise<string> => {
  try {
    const data = await response.json();

    if (typeof data === 'string') return data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
  } catch {
    // Ignore non-JSON error responses.
  }

  return fallback;
};

// =========================================================
// ID NORMALIZATION
// =========================================================

const getId = (
  value: string | number | undefined | null
): string => {
  return value == null || value === '' ? '' : String(value);
};

// =========================================================
// HTTP REQUEST HELPER
// =========================================================

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  fallback = 'Request failed.'
): Promise<T> => {
  const token = localStorage.getItem('auth_token');

  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure full URL is formed using the live Spring Boot backend
  const targetUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallback));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

// =========================================================
// JSON REQUEST OPTIONS
// =========================================================

const jsonOptions = (
  method: string,
  body?: unknown
): RequestInit => ({
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(body === undefined
    ? {}
    : {
        body: JSON.stringify(body),
      }),
});

// =========================================================
// API
// =========================================================

export const api = {
  // =======================================================
  // AUTHENTICATION - LOGIN
  // Backend response: { token, id, name, email, role }
  // Frontend response: { token, user: { id, name, email, role } }
  // =======================================================

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: User }> {
    const email = data.email?.trim();

    if (!email) {
      throw new Error('Email is required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    if (!data.password) {
      throw new Error('Password is required.');
    }

    const response = await request<{
      token?: string;
      id?: string | number;
      name?: string;
      email?: string;
      role?: string;
    }>(
      '/api/auth/login',
      jsonOptions('POST', {
        email,
        password: data.password,
      }),
      'Login failed. Please check your credentials.'
    );

    if (
      !response?.token ||
      response.id == null ||
      !response.role
    ) {
      throw new Error(
        'Invalid login response from the server.'
      );
    }

    const user = {
      id: response.id,
      name: response.name ?? '',
      email: response.email ?? email,
      role: response.role,
    } as User;

    return {
      token: response.token,
      user,
    };
  },

  // =======================================================
  // AUTHENTICATION - REGISTER
  // =======================================================

  async register(data: {
    name: string;
    email: string;
    username: string;
    collegeId: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<{ token: string; user: User }> {
    if (!data.name?.trim()) {
      throw new Error('Name is required.');
    }

    const email = data.email?.trim();

    if (!email) {
      throw new Error('Email is required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    if (
      !data.username?.trim() ||
      data.username.trim().length < 3
    ) {
      throw new Error(
        'Username must contain at least 3 characters.'
      );
    }

    if (!data.collegeId?.trim()) {
      throw new Error('College ID is required.');
    }

    if (
      !data.password ||
      data.password.length < 8 ||
      !/^[A-Z]/.test(data.password)
    ) {
      throw new Error(
        'Password must contain at least 8 characters and start with an uppercase letter.'
      );
    }

    if (
      ![
        'ROLE_STUDENT',
        'ROLE_RECRUITER',
        'ROLE_ADMIN',
      ].includes(data.role)
    ) {
      throw new Error('Please select a valid role.');
    }

    const response = await request<{
      token?: string;
      id?: string | number;
      name?: string;
      email?: string;
      role?: string;
    }>(
      '/api/auth/register',
      jsonOptions('POST', {
        name: data.name.trim(),
        email,
        username: data.username.trim(),
        collegeId: data.collegeId.trim(),
        password: data.password,
        role: data.role,
        phone: data.phone?.trim() || '',
      }),
      'Registration failed.'
    );

    if (
      !response?.token ||
      response.id == null ||
      !response.role
    ) {
      throw new Error(
        'Invalid registration response from the server.'
      );
    }

    const user = {
      id: response.id,
      name: response.name ?? data.name.trim(),
      email: response.email ?? email,
      role: response.role,
    } as User;

    return {
      token: response.token,
      user,
    };
  },

  // =======================================================
  // STUDENT PROFILE
  // =======================================================

  async getStudentProfile(
    userId?: string
  ): Promise<StudentProfile> {
    const query = userId
      ? `?userId=${encodeURIComponent(userId)}`
      : '';

    return request(
      `/api/students/profile${query}`,
      {},
      'Failed to fetch student profile.'
    );
  },

  async updateStudentProfile(
    profile: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    return request(
      '/api/students/profile',
      jsonOptions('PUT', profile),
      'Failed to update student profile.'
    );
  },

  async getAllStudents(): Promise<StudentProfile[]> {
    return request(
      '/api/students',
      {},
      'Failed to fetch students.'
    );
  },

  // =======================================================
  // RESUME
  // =======================================================

  async uploadResume(
    file: File,
    userId?: string
  ): Promise<{
    fileName: string;
    uploadedAt: string;
    resumeUrl: string;
  }> {
    if (!file) {
      throw new Error('Please select a resume file.');
    }

    if (
      !(
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      )
    ) {
      throw new Error('Only PDF resumes are allowed.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        'Resume must be smaller than 10 MB.'
      );
    }

    const formData = new FormData();
    formData.append('resume', file, file.name);

    const query = userId
      ? `?userId=${encodeURIComponent(userId)}`
      : '';

    return request(
      `/api/students/resume/upload${query}`,
      {
        method: 'POST',
        body: formData,
      },
      'Failed to upload resume.'
    );
  },

  // =======================================================
  // JOBS
  // =======================================================

  async getJobs(params?: {
    search?: string;
    type?: string;
    companyId?: string;
  }): Promise<Job[]> {
    const query = new URLSearchParams();

    if (params?.search) {
      query.append('search', params.search);
    }

    if (params?.type) {
      query.append('type', params.type);
    }

    if (params?.companyId) {
      query.append('companyId', params.companyId);
    }

    const suffix = query.toString()
      ? `?${query.toString()}`
      : '';

    return request(
      `/api/jobs${suffix}`,
      {},
      'Failed to fetch jobs.'
    );
  },

  async createJob(
    jobData: Partial<Job>
  ): Promise<Job> {
    return request(
      '/api/jobs',
      jsonOptions('POST', jobData),
      'Failed to create job.'
    );
  },

  async updateJobStatus(
    jobId: string,
    status: string
  ): Promise<Job> {
    if (!jobId) {
      throw new Error('Job ID is required.');
    }

    return request(
      `/api/jobs/${encodeURIComponent(jobId)}/status`,
      jsonOptions('PATCH', { status }),
      'Failed to update job status.'
    );
  },

  // =======================================================
  // APPLICATIONS
  // =======================================================

  async getApplications(params?: {
    studentId?: string;
    jobId?: string;
  }): Promise<Application[]> {
    const query = new URLSearchParams();

    if (params?.studentId) {
      query.append(
        'studentId',
        getId(params.studentId)
      );
    }

    if (params?.jobId) {
      query.append('jobId', getId(params.jobId));
    }

    const suffix = query.toString()
      ? `?${query.toString()}`
      : '';

    return request(
      `/api/applications${suffix}`,
      {},
      'Failed to fetch applications.'
    );
  },

  async applyToJob(
    jobId: string,
    studentId: string,
    coverNote?: string
  ): Promise<Application> {
    const numericJobId = Number(jobId);
    const numericStudentId = Number(studentId);

    if (
      !Number.isFinite(numericJobId) ||
      !Number.isFinite(numericStudentId)
    ) {
      throw new Error('Invalid job or student ID.');
    }

    return request(
      '/api/applications',
      jsonOptions('POST', {
        jobId: numericJobId,
        studentId: numericStudentId,
        coverNote: coverNote || '',
      }),
      'Failed to apply for job.'
    );
  },

  async updateApplicationStatus(
    appId: string,
    status: string
  ): Promise<Application> {
    if (!appId) {
      throw new Error('Application ID is required.');
    }

    return request(
      `/api/applications/${encodeURIComponent(appId)}/status`,
      jsonOptions('PATCH', { status }),
      'Failed to update application status.'
    );
  },

  // =======================================================
  // INTERVIEWS
  // =======================================================

  async getInterviews(): Promise<Interview[]> {
    return request(
      '/api/interviews',
      {},
      'Failed to fetch interviews.'
    );
  },

  async scheduleInterview(
    data: Partial<Interview>
  ): Promise<Interview> {
    return request(
      '/api/interviews',
      jsonOptions('POST', data),
      'Failed to schedule interview.'
    );
  },

  // =======================================================
  // PLACEMENT DRIVES
  // =======================================================

  async getDrives(): Promise<PlacementDrive[]> {
    return request(
      '/api/drives',
      {},
      'Failed to fetch placement drives.'
    );
  },

  async createDrive(
    data: Partial<PlacementDrive>
  ): Promise<PlacementDrive> {
    return request(
      '/api/drives',
      jsonOptions('POST', data),
      'Failed to create placement drive.'
    );
  },

  async registerForDrive(
    driveId: string,
    studentId: string
  ): Promise<PlacementDrive> {
    const numericDriveId = Number(driveId);
    const numericStudentId = Number(studentId);

    if (
      !Number.isFinite(numericDriveId) ||
      !Number.isFinite(numericStudentId)
    ) {
      throw new Error('Invalid drive or student ID.');
    }

    return request(
      `/api/drives/${encodeURIComponent(driveId)}/register`,
      jsonOptions('POST', {
        studentId: numericStudentId,
      }),
      'Failed to register for drive.'
    );
  },

  // =======================================================
  // NOTIFICATIONS
  // =======================================================

  async getNotifications(
    userId?: string
  ): Promise<NotificationItem[]> {
    const query = userId
      ? `?userId=${encodeURIComponent(userId)}`
      : '?userId=all';

    return request(
      `/api/notifications${query}`,
      {},
      'Failed to fetch notifications.'
    );
  },

  async markNotificationRead(
    id: string
  ): Promise<void> {
    if (!id) {
      throw new Error('Notification ID is required.');
    }

    return request(
      `/api/notifications/${encodeURIComponent(id)}/read`,
      { method: 'PATCH' },
      'Failed to mark notification as read.'
    );
  },

  async markAllNotificationsRead(
    userId?: string
  ): Promise<void> {
    const numericUserId =
      userId && Number.isFinite(Number(userId))
        ? Number(userId)
        : undefined;

    return request(
      '/api/notifications/mark-all-read',
      jsonOptions('POST', {
        userId: numericUserId,
      }),
      'Failed to mark notifications as read.'
    );
  },

  // =======================================================
  // ADMIN
  // =======================================================

  async getAdminStats(): Promise<any> {
    return request(
      '/api/admin/stats',
      {},
      'Failed to fetch admin statistics.'
    );
  },

  // =======================================================
  // AI - RESUME ANALYSIS
  // =======================================================

  async analyzeResume(
    resumeText?: string
  ): Promise<ResumeAnalysisResult> {
    if (!resumeText?.trim()) {
      throw new Error(
        'Resume text is empty. Upload a PDF or enter resume text before analysis.'
      );
    }

    return request(
      '/api/ai/resume-analyze',
      jsonOptions('POST', {
        resumeText: resumeText.trim(),
      }),
      'Failed to analyze resume.'
    );
  },

  // =======================================================
  // AI - JOB MATCH
  // =======================================================

  async matchJob(
    studentId: string,
    jobId: string
  ): Promise<JobMatchResult> {
    const numericStudentId = Number(studentId);
    const numericJobId = Number(jobId);

    if (
      !Number.isFinite(numericStudentId) ||
      !Number.isFinite(numericJobId)
    ) {
      throw new Error('Invalid student or job ID.');
    }

    return request(
      '/api/ai/job-match',
      jsonOptions('POST', {
        studentId: numericStudentId,
        jobId: numericJobId,
      }),
      'Failed to match job.'
    );
  },

  // =======================================================
  // AI - SKILL GAP
  // =======================================================

  async getSkillGap(
    studentSkills: string[],
    targetRole: string,
    requiredSkills: string[]
  ): Promise<SkillGapResult> {
    return request(
      '/api/ai/skill-gap',
      jsonOptions('POST', {
        studentSkills,
        targetRole,
        requiredSkills,
      }),
      'Failed to analyze skill gap.'
    );
  },

  // =======================================================
  // AI - INTERVIEW PREPARATION
  // =======================================================

  async generateInterviewPrep(
    jobTitle: string,
    companyName: string,
    interviewType: string,
    difficulty: string
  ): Promise<InterviewPrepResult> {
    return request(
      '/api/ai/interview-prep',
      jsonOptions('POST', {
        jobTitle,
        companyName,
        interviewType,
        difficulty,
      }),
      'Failed to generate interview preparation.'
    );
  },

  // =======================================================
  // AI - MOCK INTERVIEW
  // =======================================================

  async sendMockInterviewMessage(
    messages: any[],
    jobTitle: string,
    companyName: string,
    candidateName: string
  ): Promise<{ reply: string }> {
    return request(
      '/api/ai/mock-interview-chat',
      jsonOptions('POST', {
        messages,
        jobTitle,
        companyName,
        candidateName,
      }),
      'Failed to get mock interview response.'
    );
  },
};