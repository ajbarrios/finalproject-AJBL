import { createContext } from 'react';

// Copiadas de AuthContext.tsx original
interface User {
  id: string;
  fullName: string;
  email: string;
  profession: string;
}
interface LoginCredentials {
  email: string;
  password: string;
}

// Se exporta AuthContextType para que el hook y el provider puedan usarla
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Se exporta AuthContext para que el hook y el provider puedan consumirlo
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 