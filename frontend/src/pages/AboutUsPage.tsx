import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-white bg-opacity-60" />
      
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6">
              <span className="block">Acerca de</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                NutriTech Solutions
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              La empresa innovadora detrás de NutriTrack Pro, dedicada a revolucionar 
              la gestión nutricional y deportiva profesional.
            </p>
          </div>

          {/* Misión y Visión */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-8 border border-indigo-200 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Nuestra Misión</h2>
              <p className="text-gray-700 leading-relaxed">
                Empoderar a los profesionales de la nutrición y entrenamiento deportivo con herramientas 
                tecnológicas avanzadas que simplifiquen la gestión de pacientes y optimicen los resultados 
                de salud y rendimiento.
              </p>
            </div>

            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-8 border border-purple-200 shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Nuestra Visión</h2>
              <p className="text-gray-700 leading-relaxed">
                Ser la plataforma líder mundial en gestión nutricional profesional, conectando 
                tecnología e innovación para crear un futuro más saludable y eficiente en el 
                cuidado nutricional personalizado.
              </p>
            </div>
          </div>

          {/* Historia de la empresa */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-8 border border-pink-200 shadow-lg mb-16">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-pink-700 mb-4">Nuestra Historia</h2>
            </div>
            <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed space-y-4">
              <p>
                NutriTech Solutions fue fundada en 2019 por un equipo de nutricionistas, desarrolladores 
                de software y especialistas en UX que compartían una visión común: transformar la manera 
                en que los profesionales de la salud gestionan y monitorean a sus pacientes.
              </p>
              <p>
                Nacimos de la frustración de observar cómo los profesionales de la nutrición perdían 
                tiempo valioso en tareas administrativas repetitivas, cuando podrían estar enfocándose 
                en lo que realmente importa: la salud y bienestar de sus pacientes.
              </p>
              <p>
                Después de años de investigación, desarrollo y colaboración directa con más de 200 
                profesionales de la salud, lanzamos NutriTrack Pro en 2021, una plataforma que combina 
                la potencia de la tecnología con la experiencia humana en nutrición.
              </p>
            </div>
          </div>

          {/* Valores de la empresa */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Los principios que guían cada decisión y cada línea de código que escribimos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-indigo-200 shadow-lg text-center">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">Innovación</h3>
                <p className="text-sm text-gray-600">
                  Buscamos constantemente nuevas formas de mejorar la experiencia profesional
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-purple-200 shadow-lg text-center">
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="text-lg font-semibold mb-2 text-purple-700">Colaboración</h3>
                <p className="text-sm text-gray-600">
                  Trabajamos estrechamente con profesionales para crear soluciones reales
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-pink-200 shadow-lg text-center">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-pink-700">Eficiencia</h3>
                <p className="text-sm text-gray-600">
                  Simplificamos procesos complejos para maximizar el tiempo con pacientes
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-green-200 shadow-lg text-center">
                <div className="text-3xl mb-4">🌱</div>
                <h3 className="text-lg font-semibold mb-2 text-green-700">Crecimiento</h3>
                <p className="text-sm text-gray-600">
                  Apoyamos el desarrollo profesional continuo de nuestros usuarios
                </p>
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Equipo</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un grupo diverso de profesionales apasionados por la tecnología y la salud
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-indigo-200 shadow-lg text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  AJ
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Dr. Ana Julia Rodríguez</h3>
                <p className="text-indigo-600 font-medium mb-2">CEO & Fundadora</p>
                <p className="text-sm text-gray-600">
                  Nutricionista clínica con 15 años de experiencia y PhD en Tecnología Alimentaria
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-purple-200 shadow-lg text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  BL
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Bruno López</h3>
                <p className="text-purple-600 font-medium mb-2">CTO & Co-fundador</p>
                <p className="text-sm text-gray-600">
                  Ingeniero de Software especializado en aplicaciones de salud y arquitecturas escalables
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-6 border border-pink-200 shadow-lg text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  MG
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">María González</h3>
                <p className="text-pink-600 font-medium mb-2">Head of Product</p>
                <p className="text-sm text-gray-600">
                  Especialista en UX/UI con background en psicología y diseño centrado en el usuario
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-8 border border-indigo-200 shadow-lg mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">En Números</h2>
              <p className="text-lg text-gray-600">El impacto de NutriTrack Pro en la comunidad profesional</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                <p className="text-gray-600">Profesionales activos</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">15,000+</div>
                <p className="text-gray-600">Pacientes gestionados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 mb-2">25,000+</div>
                <p className="text-gray-600">Planes nutricionales creados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-gray-600">Satisfacción del usuario</p>
              </div>
            </div>
          </div>

          {/* Llamada a la acción */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">¿Listo para transformar tu práctica profesional?</h2>
              <p className="text-lg mb-6 opacity-90">
                Únete a cientos de profesionales que ya confían en NutriTrack Pro
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/registro"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                >
                  Comenzar Gratis
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-all duration-200"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUsPage; 