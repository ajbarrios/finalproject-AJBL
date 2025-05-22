import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a login después del logout
  };

  // Icono SVG para Logout (simple)
  const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold hover:text-indigo-200">
          NutriTrack Pro
        </Link>

        <div>
          {isAuthenticated && user ? (
            <div className="flex items-center">
              <span className="mr-4">{`Hola, ${user.fullName}`}</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                aria-label="Cerrar sesión"
              >
                <LogoutIcon />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-indigo-200">Iniciar Sesión</Link>
              <Link to="/registro" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 text-sm font-medium">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 