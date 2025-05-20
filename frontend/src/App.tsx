// import './App.css'; // Eliminada esta importación ya que App.css no existe en src/
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.tsx'
import { Toaster } from 'react-hot-toast'

// Componente para la página de inicio temporal
const HomePage = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
    <div className="bg-white shadow-xl rounded-lg p-8 md:p-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-6">
        ¡Bienvenido a NutriTrack Pro!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Tu asistente profesional para la nutrición y el entrenamiento.
      </p>
      <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
        Ir a Registro de Profesional
      </Link>
    </div>
  </div>
)

// Componente temporal para la página de Login (solo para que el enlace funcione)
const LoginPagePlaceholder = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-3xl font-bold">Página de Login (Pronto)</h1>
    <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-800">Volver al Inicio</Link>
  </div>
)

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPagePlaceholder />} /> {/* Ruta placeholder para login */}
        {/* Aquí se añadirán más rutas */}
      </Routes>
    </Router>
  )
}

export default App
