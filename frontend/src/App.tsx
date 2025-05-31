// import './App.css'; // Eliminada esta importación ya que App.css no existe en src/
import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'

// Importaciones de la autenticación y páginas nuevas
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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

import Navbar from './components/common/Navbar';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientProfilePage from './pages/PatientProfilePage';
import NewPatientPage from './pages/NewPatientPage';
import PatientEditPage from './pages/PatientEditPage';
import NewBiometricRecordPage from './pages/NewBiometricRecordPage';
import PatientBiometricHistoryPage from './pages/patients/PatientBiometricHistoryPage';

// Componente para la página de inicio temporal (si no hay otra)
const HomePage = () => (
  <div className="container mx-auto mt-10 p-4 text-center">
    <h1 className="text-3xl font-bold mb-4">Bienvenido a NutriTrack Pro</h1>
    <p className="mb-6">Gestiona tus pacientes y sus planes de forma eficiente.</p>
  </div>
);

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
            <Route path="/dashboard" element={<ProtectedRoute><PatientDashboardPage /></ProtectedRoute>} />
            <Route path="/patients/:patientId" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
            <Route path="/patients/new" element={<ProtectedRoute><NewPatientPage /></ProtectedRoute>} />
            <Route path="/patients/:patientId/edit" element={<ProtectedRoute><PatientEditPage /></ProtectedRoute>} />
            <Route path="/patients/:patientId/biometric-records/new" element={<ProtectedRoute><NewBiometricRecordPage /></ProtectedRoute>} />
            <Route path="/patients/:patientId/biometric-records" element={<ProtectedRoute><PatientBiometricHistoryPage /></ProtectedRoute>} />

            {/* Ruta principal: redirige a dashboard si está autenticado, sino a login */}
            <Route 
              path="/"
              element={auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />}
            />
            
            {/* Ruta comodín para páginas no encontradas */}
            <Route path="*" element={<div className="text-center mt-10"><h1 className="text-2xl">404 - Página No Encontrada</h1><Link to="/" className="text-indigo-600 hover:underline">Volver al inicio</Link></div>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  )
}

export default App
