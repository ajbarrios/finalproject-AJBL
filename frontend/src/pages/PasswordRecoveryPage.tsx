import React from 'react';
import { Link } from 'react-router-dom';

const PasswordRecoveryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Contraseña
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Información importante
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-4">
                    Para recuperar tu contraseña, por favor contacta con el administrador de NutriTrack Pro.
                  </p>
                  <div className="bg-white p-4 rounded-md border border-blue-200">
                    <p className="font-medium text-blue-900 mb-2">
                      Correo del administrador:
                    </p>
                    <a 
                      href="mailto:nutritrackpro.team@gmail.com?subject=Solicitud de recuperación de contraseña&body=Hola, necesito recuperar mi contraseña para acceder a NutriTrack Pro. Mi email registrado es: "
                      className="text-indigo-600 hover:text-indigo-800 font-medium break-all"
                    >
                      nutritrackpro.team@gmail.com
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-blue-600">
                    💡 Al hacer clic en el email se abrirá tu cliente de correo con un mensaje preescrito.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Instrucciones para la solicitud
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Por favor incluye en tu mensaje:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Tu email registrado en la plataforma</li>
                    <li>Tu nombre completo</li>
                    <li>Tu profesión (Nutricionista/Entrenador)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Link 
              to="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Volver al Login
            </Link>
            
            <Link 
              to="/registro"
              className="w-full flex justify-center py-3 px-4 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryPage; 