// import './App.css'; // Eliminada esta importación ya que App.css no existe en src/
import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'

// Importaciones de la autenticación y páginas nuevas
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Componentes de Ruta
interface RouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="text-center mt-20">Cargando autenticación...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute: React.FC<RouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="text-center mt-20">Cargando autenticación...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

import Navbar from './components/layout/Navbar';

// Componente para la página de inicio temporal (si no hay otra)
const HomePage = () => (
  <div className="container mx-auto mt-10 p-4 text-center">
    <h1 className="text-3xl font-bold mb-4">Bienvenido a NutriTrack Pro</h1>
    <p className="mb-6">Gestiona tus pacientes y sus planes de forma eficiente.</p>
  </div>
);

// Placeholder simple para el Dashboard
const DashboardPagePlaceholder = () => {
  const { user } = useAuth();
  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p className="mt-2">Hola, {user.fullName}!</p>}
      <p className="mt-4">Aquí verás el resumen de tu actividad.</p>
    </div>
  );
};

function App() {
  const auth = useAuth(); // Para la redirección principal

  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Cargando aplicación...</div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="container mx-auto p-4 mt-2 min-h-[calc(100vh-80px)]"> {/* Ajustar según altura real de Navbar */}
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            {/* <Route path="/recuperar-password" element={<GuestRoute><ForgotPasswordInfoPage /></GuestRoute>} /> */}

            {/* Rutas protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPagePlaceholder /></ProtectedRoute>} />

            {/* Ruta principal: redirige a dashboard si está autenticado, sino a login */}
            <Route 
              path="/"
              element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />}
            />
            
            {/* Ruta comodín para páginas no encontradas */}
            <Route path="*" element={<div className="text-center mt-10"><h1 className="text-2xl">404 - Página No Encontrada</h1><Link to="/" className="text-indigo-600 hover:underline">Volver al inicio</Link></div>} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </Router>
  )
}

export default App
