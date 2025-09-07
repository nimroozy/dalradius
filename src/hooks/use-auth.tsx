import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

// Mock user data for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@isphome.com",
    role: "admin",
    avatar: "",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Sales Agent",
    email: "sales@isphome.com",
    role: "sales",
    avatar: "",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Technical Manager",
    email: "tech@isphome.com",
    role: "technical_manager",
    avatar: "",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Technician",
    email: "technician@isphome.com",
    role: "technician",
    avatar: "",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Finance Officer",
    email: "finance@isphome.com",
    role: "finance",
    avatar: "",
    createdAt: "2023-01-01T00:00:00Z",
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication (in a real app, this would be an API call)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom HOC for route protection
export const withAuth = (Component: React.ComponentType) => {
  const AuthComponent = (props: React.ComponentProps<typeof Component>) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, isLoading, navigate]);
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    return <Component {...props} />;
  };
  
  return AuthComponent;
};