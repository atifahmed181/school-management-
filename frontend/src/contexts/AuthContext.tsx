import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

type User = { role: string };
type AuthContextType = {
  user: User | null;
  login: (creds: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        if (payload) {
          const decodedPayload = atob(payload);
          const parsedPayload = JSON.parse(decodedPayload);
          if (parsedPayload?.role) {
            setUser({ role: parsedPayload.role });
          } else {
            // Invalid token format - missing role
            localStorage.removeItem('token');
          }
        } else {
          // Invalid token format - not a JWT
          localStorage.removeItem('token');
        }
      } catch (error) {
        // Error parsing token
        console.error('Error parsing auth token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser({ role: data.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};