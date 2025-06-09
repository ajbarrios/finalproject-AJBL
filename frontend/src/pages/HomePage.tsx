import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-white bg-opacity-60" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">
            <span className="block">NutriTrack</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Pro
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            La plataforma integral para profesionales de la nutrición y entrenamiento deportivo. 
            Gestiona tus pacientes, crea planes personalizados y monitorea su progreso.
          </p>
          
          {/* Características principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-gray-800">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-indigo-200 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-indigo-700">Seguimiento Completo</h3>
              <p className="text-sm text-gray-600">Monitorea el progreso biométrico de tus pacientes</p>
            </div>
            
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-purple-200 shadow-lg">
              <div className="text-3xl mb-4">🥗</div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Planes Nutricionales</h3>
              <p className="text-sm text-gray-600">Crea dietas personalizadas y planes de entrenamiento</p>
            </div>
            
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-pink-200 shadow-lg">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2 text-pink-700">Gestión Eficiente</h3>
              <p className="text-sm text-gray-600">Administra todos tus pacientes desde una sola plataforma</p>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span className="relative">Iniciar Sesión</span>
            </Link>
            
            <Link
              to="/registro"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg border border-indigo-200"
            >
              <span className="relative">Registrarse</span>
            </Link>
          </div>
          
          {/* Información adicional */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600">
              ¿Eres profesional de la nutrición o entrenamiento deportivo?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Únete a NutriTrack Pro y transforma la manera de gestionar a tus pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 