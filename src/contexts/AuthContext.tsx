import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';

// Mock types for development
interface User {
  id: string;
  email?: string;
}

interface Session {
  user: User;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  role: 'inspector' | 'supervisor' | 'admin' | 'superadmin';
  department: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'inspector' | 'supervisor' | 'admin') => Promise<void>;
}

// Mock users for development
const mockUsers = [
  { id: '1', email: 'admin@datacenter.com', password: 'SuperAdmin123!', profile: { id: '1', full_name: 'Super Admin', role: 'superadmin' as const, department: 'datacenter', active: true } },
  { id: '2', email: 'inspector@datacenter.com', password: 'Inspector123!', profile: { id: '2', full_name: 'Inspector', role: 'inspector' as const, department: 'datacenter', active: true } },
  { id: '3', email: 'supervisor@datacenter.com', password: 'Supervisor123!', profile: { id: '3', full_name: 'Supervisor', role: 'supervisor' as const, department: 'datacenter', active: true } },
  { id: '4', email: 'admin2@datacenter.com', password: 'Admin123!', profile: { id: '4', full_name: 'Admin', role: 'admin' as const, department: 'datacenter', active: true } }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData.user);
      setProfile(userData.profile);
      setSession({ user: userData.user });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Credenciales inválidas');
    }

    if (!mockUser.profile.active) {
      throw new Error('Usuario inactivo');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

    const userData = { user: { id: mockUser.id, email: mockUser.email }, profile: mockUser.profile };
    
    setUser(userData.user);
    setProfile(userData.profile);
    setSession({ user: userData.user });
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('currentUser');
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'inspector' | 'supervisor' | 'admin') => {
    // Only superadmin can create users
    if (profile?.role !== 'superadmin') {
      throw new Error('No tienes permisos para crear usuarios');
    }

    // Mock user creation - in a real app this would create in Supabase
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      profile: { id: Date.now().toString(), full_name: fullName, role, department: 'datacenter', active: true }
    };
    
    mockUsers.push(newUser);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};