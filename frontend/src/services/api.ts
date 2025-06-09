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
      console.log('Token caducado o inválido. Mostrando mensaje y redirigiendo al login...');
      
      // Eliminar el token inválido del localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      // Redirigir al usuario a la página de login después de un pequeño delay
      // para que el usuario pueda ver el mensaje
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
      // Devolver un error personalizado para evitar que se muestre "network error"
      return Promise.reject(new Error('Sesión expirada'));
    }
    
    // Para otros errores, NO mostrar toast aquí para evitar duplicados
    // El manejo se hace en errorHandler.ts o en los componentes individuales
    
    // Devolver el error para que pueda ser manejado por el código que hizo la solicitud original
    return Promise.reject(error);
  }
);

export default api;
