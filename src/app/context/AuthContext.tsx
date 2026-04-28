import React, { createContext, useContext, useState } from 'react';

type Role = 'admin' | 'user' | null;

interface AuthContextType {
  role: Role;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  const login = (email: string) => {
    // In a real app, this is where you call your database
    if (email.includes('admin')) setRole('admin');
    else setRole('user');
  };

  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};