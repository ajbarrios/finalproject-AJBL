// import './App.css'; // Eliminada esta importación ya que App.css no existe en src/
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Importaciones de la autenticación y páginas nuevas
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'

// Páginas existentes/placeholders
import RegisterPage from './pages/auth/RegisterPage.tsx'
// import HomePage from './pages/HomePage' // Si tienes una HomePage diferente, ajústalo

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
      <Link to="/login" className="mr-2 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
        Ir a Login
      </Link>
      <Link to="/register" className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
        Ir a Registro de Profesional
      </Link>
    </div>
  </div>
)

// Placeholder para Dashboard (hasta que se implemente)
const DashboardPagePlaceholder = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-3xl font-bold">Dashboard (Pronto)</h1>
    {/* Aquí podrías añadir un botón de Logout usando useAuth().logout si está protegido */}
    <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-800">Volver al Inicio</Link>
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Ruta de Dashboard (eventualmente protegida) */}
          <Route path="/dashboard" element={<DashboardPagePlaceholder />} />
          
          {/* Podrías añadir una ruta para /recuperar-password si la creas */}
          {/* <Route path="/recuperar-password" element={<ForgotPasswordPage />} /> */}

          {/* Considera una ruta NotFoundPage para cualquier ruta no coincidente */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
