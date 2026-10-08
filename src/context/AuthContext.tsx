import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  User,
  UserRole,
  StudentProfile,
  NotificationItem,
} from '../types';

import { api } from '../services/api';

interface RegisterData {
  name: string;
  email: string;
  username: string;
  collegeId: string;
  password: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  studentProfile: StudentProfile | null;
  notifications: NotificationItem[];
  unreadCount: number;

  completeLogin: (
    authenticatedUser: User,
    token: string
  ) => Promise<void>;

  loginWithCredentials: (
    email: string,
    username: string,
    collegeId: string,
    password: string,
    role: UserRole
  ) => Promise<void>;

  registerWithCredentials: (
    data: RegisterData
  ) => Promise<void>;

  loginWithEmail: (
    email: string,
    role?: UserRole
  ) => Promise<void>;

  loginAs: (
    role: UserRole
  ) => Promise<void>;

  logout: () => void;
  refreshProfile: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('ROLE_STUDENT');
  const [studentProfile, setStudentProfile] =
    useState<StudentProfile | null>(null);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const saveAuthentication = (
    authenticatedUser: User,
    token: string
  ) => {
    setUser(authenticatedUser);
    setRole(authenticatedUser.role);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('active_role', authenticatedUser.role);
    localStorage.setItem(
      'auth_user',
      JSON.stringify(authenticatedUser)
    );
  };

  const loadAuthenticatedUserData = async (
    authenticatedUser: User
  ) => {
    if (authenticatedUser.role === 'ROLE_STUDENT') {
      try {
        const profile = await api.getStudentProfile();
        setStudentProfile(profile);
      } catch (error) {
        console.error('Could not load student profile:', error);
        setStudentProfile(null);
      }
    } else {
      setStudentProfile(null);
    }

    try {
      const result = await api.getNotifications();
      setNotifications(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Could not load notifications:', error);
      setNotifications([]);
    }
  };

  // Complete login and update React authentication state.
  const completeLogin = async (
    authenticatedUser: User,
    token: string
  ): Promise<void> => {
    if (!token || !authenticatedUser?.id) {
      throw new Error('Invalid authentication response.');
    }

    saveAuthentication(authenticatedUser, token);

    await loadAuthenticatedUserData(authenticatedUser);
  };

  // Restore a previously saved login session.
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const storedRole = localStorage.getItem('active_role');

    if (!storedToken || !storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      if (!parsedUser?.id || !parsedUser?.role) {
        throw new Error('Invalid stored user.');
      }

      setUser(parsedUser);
      setRole(parsedUser.role || (storedRole as UserRole));
    } catch (error) {
      console.error('Failed to restore login session:', error);

      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('active_role');
    }
  }, []);

  const loginWithCredentials = async (
    email: string,
    _username: string,
    _collegeId: string,
    password: string,
    requestedRole: UserRole
  ) => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      throw new Error('Email and password are required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      // The Spring Boot login endpoint accepts email and password.
      const response = await api.login({
        email: cleanEmail,
        password,
      });

      if (!response?.token || !response?.user) {
        throw new Error('Invalid login response from server.');
      }

      if (
        requestedRole &&
        response.user.role !== requestedRole
      ) {
        throw new Error(
          'The selected role does not match this account.'
        );
      }

      await completeLogin(response.user, response.token);
    } catch (error) {
      console.error('Login error:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const registerWithCredentials = async (
    data: RegisterData
  ) => {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim();
    const cleanUsername = data.username.trim();
    const cleanCollegeId = data.collegeId.trim();

    if (!cleanName || !cleanEmail || !data.password) {
      throw new Error('Name, email, and password are required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    if (cleanUsername.length < 3) {
      throw new Error('Username must contain at least 3 characters.');
    }

    if (!cleanCollegeId) {
      throw new Error('College ID is required.');
    }

    if (data.password.length < 8) {
      throw new Error('Password must contain at least 8 characters.');
    }

    if (!/^[A-Z]/.test(data.password)) {
      throw new Error(
        'The first character of the password must be uppercase.'
      );
    }

    try {
      const response = await api.register({
        name: cleanName,
        email: cleanEmail,
        username: cleanUsername,
        collegeId: cleanCollegeId,
        password: data.password,
        role: data.role,
        phone: data.phone?.trim() || '',
      });

      if (!response?.token || !response?.user) {
        throw new Error('Invalid registration response from server.');
      }

      await completeLogin(response.user, response.token);
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Registration failed.');
    }
  };

  const loginWithEmail = async (
    _email: string,
    _requestedRole?: UserRole
  ) => {
    throw new Error(
      'Please use the login form with your email and password.'
    );
  };

  const loginAs = async (_newRole: UserRole) => {
    throw new Error(
      'Please log in with an account that has the selected role.'
    );
  };

  const logout = () => {
    setUser(null);
    setRole('ROLE_STUDENT');
    setStudentProfile(null);
    setNotifications([]);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_role');
    localStorage.removeItem('auth_user');
  };

  const refreshProfile = async () => {
    if (!user?.id || role !== 'ROLE_STUDENT') {
      setStudentProfile(null);
      return;
    }

    try {
      const profile = await api.getStudentProfile();
      setStudentProfile(profile);
    } catch (error) {
      console.error('Could not refresh student profile:', error);
    }
  };

  const refreshNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    try {
      const result = await api.getNotifications();
      setNotifications(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Could not refresh notifications:', error);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setStudentProfile(null);
      setNotifications([]);
      return;
    }

    void refreshProfile();
    void refreshNotifications();

    const interval = window.setInterval(() => {
      void refreshNotifications();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [user?.id, role]);

  const markNotificationRead = async (id: string) => {
    if (!id) return;

    await api.markNotificationRead(id);

    setNotifications((previous) =>
      previous.map((notification) =>
        String(notification.id) === String(id)
          ? { ...notification, status: 'READ' }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.status === 'UNREAD'
  ).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        studentProfile,
        notifications,
        unreadCount,
        completeLogin,
        loginWithCredentials,
        registerWithCredentials,
        loginWithEmail,
        loginAs,
        logout,
        refreshProfile,
        refreshNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};