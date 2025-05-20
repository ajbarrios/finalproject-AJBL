import React, { useState, useEffect, type ReactNode } from 'react';
import { loginUser } from '../services/authService';
import { AuthContext } from './AuthContextValue'; // Solo importa AuthContext (objeto)

// Interfaces que necesita el Provider. Podrían ir a un archivo de tipos si se usan en más sitios.
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
interface ApiUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
}
interface AuthApiResponse {
  message: string;
  token: string;
  data: ApiUserData;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem('authUser');
          setUser(null);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const authData: AuthApiResponse = await loginUser(credentials) as AuthApiResponse;
      console.log("Auth Data Received from API:", authData);

      if (authData && authData.token && authData.data) {
        localStorage.setItem('authToken', authData.token);
        const userData: User = {
          id: String(authData.data.id),
          fullName: `${authData.data.firstName} ${authData.data.lastName}`,
          email: authData.data.email,
          profession: authData.data.profession,
        };
        localStorage.setItem('authUser', JSON.stringify(userData));
        setToken(authData.token);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.error("Respuesta de login inesperada (estructura interna):", authData);
        throw new Error('Respuesta de inicio de sesión inesperada del servidor (estructura interna).');
      }
    } catch (error) {
      console.error("Login failed in AuthProvider:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ocurrió un error desconocido durante el login.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 