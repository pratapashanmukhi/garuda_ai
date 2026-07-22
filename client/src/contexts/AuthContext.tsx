import { createContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Investigator' | 'Senior Investigator' | 'Bank Officer' | 'Auditor' | 'Read-only Analyst';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('garuda_token');
      const savedUser = localStorage.getItem('garuda_user');
      if (savedToken && savedUser && savedUser !== 'undefined') {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to parse saved auth session', err);
      localStorage.removeItem('garuda_token');
      localStorage.removeItem('garuda_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('garuda_token', newToken);
    localStorage.setItem('garuda_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('garuda_token');
    localStorage.removeItem('garuda_user');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#081229', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Authenticating Secure Session...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}


