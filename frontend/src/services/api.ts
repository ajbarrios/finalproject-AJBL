import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Si hay un error en la respuesta
    if (error.response && error.response.status === 401) {
      // Si el estado es 401 (No autorizado), significa que el token ha caducado o es inválido
      console.log('Token caducado o inválido. Redirigiendo al login...');
      // Eliminar el token inválido del localStorage
      localStorage.removeItem('authToken');
      // Redirigir al usuario a la página de login
      // Una forma sencilla de forzar la redirección es recargar la página, 
      // asumiendo que tu lógica de enrutamiento maneja la redirección 
      // a /login si no hay un token válido.
      window.location.href = '/login'; 
      
      // O podrías usar react-router-dom's navigate aquí si estuviera disponible
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate(); // No se puede usar hooks aquí directamente
      // navigate('/login'); // Esto no funcionará en un interceptor global así

    }
    // Devolver el error para que pueda ser manejado por el código que hizo la solicitud original
    return Promise.reject(error);
  }
);

export default api;
