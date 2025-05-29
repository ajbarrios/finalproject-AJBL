import axios from 'axios';
import api from './api'; // Importar la instancia de api centralizada

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

// Actualizamos el tipo de retorno de la promesa a AuthApiResponse
export const loginUser = async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
  try {
    // Usamos la instancia api centralizada para la llamada post
    const response = await api.post<AuthApiResponse>('/auth/login', credentials);
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
