import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/forensics';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoUser: boolean;
  pendingVerificationEmail: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsDemo: () => void;
  register: (fullName: string, email: string, pass: string) => Promise<boolean>;
  verifyEmailToken: (token?: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  logout: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr-demo-001',
  email: 'demo@truthlens.ai',
  fullName: 'Senior Investigator (Demo)',
  role: 'Lead Examiner',
  organization: 'Digital Forensics Lab',
  isVerified: true,
  isDemo: true,
  createdAt: '2026-10-01 08:00:00'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('truthlense_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USER;
      }
    }
    return DEMO_USER;
  });

  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('truthlense_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('truthlense_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (email === 'demo@truthlens.ai' && pass === 'Demo@12345') {
      setUser(DEMO_USER);
      return true;
    }

    const registeredUsersStr = localStorage.getItem('truthlense_registered_users');
    if (registeredUsersStr) {
      const registered = JSON.parse(registeredUsersStr);
      const found = registered.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
      if (found) {
        if (!found.isVerified) {
          setPendingVerificationEmail(found.email);
          throw new Error('EMAIL_NOT_VERIFIED');
        }
        setUser({
          id: found.id,
          email: found.email,
          fullName: found.fullName,
          role: 'Forensic Analyst',
          organization: 'Digital Forensics Lab',
          isVerified: true,
          isDemo: false,
          createdAt: found.createdAt
        });
        return true;
      }
    }

    throw new Error('INVALID_CREDENTIALS');
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
  };

  const register = async (fullName: string, email: string, pass: string): Promise<boolean> => {
    const registeredUsersStr = localStorage.getItem('truthlense_registered_users');
    const registered = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
    
    if (registered.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const newUserRecord = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      password: pass,
      isVerified: false,
      verificationToken: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    registered.push(newUserRecord);
    localStorage.setItem('truthlense_registered_users', JSON.stringify(registered));
    setPendingVerificationEmail(email);
    return true;
  };

  const verifyEmailToken = async (token?: string): Promise<boolean> => {
    if (!pendingVerificationEmail) return false;
    const registeredUsersStr = localStorage.getItem('truthlense_registered_users');
    if (!registeredUsersStr) return false;

    const registered = JSON.parse(registeredUsersStr);
    const userIndex = registered.findIndex((u: any) => u.email.toLowerCase() === pendingVerificationEmail.toLowerCase());
    if (userIndex === -1) return false;

    registered[userIndex].isVerified = true;
    localStorage.setItem('truthlense_registered_users', JSON.stringify(registered));

    setUser({
      id: registered[userIndex].id,
      email: registered[userIndex].email,
      fullName: registered[userIndex].fullName,
      role: 'Forensic Analyst',
      organization: 'Digital Forensics Lab',
      isVerified: true,
      isDemo: false,
      createdAt: registered[userIndex].createdAt
    });

    setPendingVerificationEmail(null);
    return true;
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('truthlense_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isDemoUser: !!user?.isDemo,
      pendingVerificationEmail,
      login,
      loginAsDemo,
      register,
      verifyEmailToken,
      resendVerificationEmail,
      logout,
      setPendingVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
