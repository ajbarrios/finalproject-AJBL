import axios from 'axios';

// Define el tipo para las credenciales de login
interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz para la estructura "data" que viene de la API (duplicada de AuthContext, podría centralizarse)
interface ApiUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
}

// Interfaz para la respuesta completa de la API de login (actualizada)
interface AuthApiResponse {
  message: string;
  token: string;
  data: ApiUserData; 
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Actualizamos el tipo de retorno de la promesa a AuthApiResponse
export const loginUser = async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
  try {
    // Especificamos que el tipo de respuesta de apiClient.post es AuthApiResponse
    const response = await apiClient.post<AuthApiResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Intentar acceder a error.response.data.message si existe, de lo contrario un mensaje genérico
      const message = (error.response.data as { message?: string })?.message || 'Error en el inicio de sesión';
      throw new Error(message);
    } else {
      throw new Error('Error de red o problema al conectar con el servidor.');
    }
  }
};

// Interceptor para añadir el token JWT a las cabeceras
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient; 