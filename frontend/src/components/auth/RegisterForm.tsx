import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../common/Spinner';

// Esquema de validación con Zod actualizado
const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'Los apellidos son requeridos'),
  email: z.string().email('El correo electrónico no es válido').min(1, 'El correo electrónico es requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .min(1, 'La contraseña es requerida'),
  confirmarPassword: z.string().min(1, 'La confirmación de contraseña es requerida'),
  profession: z.enum(['NUTRITIONIST', 'TRAINER'], { 
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        // Esto se activará si el valor no es NUTRITIONIST o TRAINER (ej. "" o undefined)
        return { message: 'Debes seleccionar una profesión' };
      }
      return { message: ctx.defaultError }; // Fallback para otros posibles errores del enum
    }
  })
}).refine(data => data.password === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmarPassword: '',
      profession: undefined,
    }
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmarPassword, ...payload } = data;
      const API_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/auth/register` : 'http://localhost:3000/api/auth/register';
      
      console.log('Enviando datos:', payload);
      const response = await axios.post(API_URL, payload);

      if (response.status === 201) {
        toast.success('¡Registro completado! Serás redirigido para iniciar sesión.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        const errorMessage = responseData?.message || 'Error desconocido del servidor';

        if (error.response.status === 409) {
          const emailErrorMessage = responseData?.errors?.email || 'Este correo electrónico ya está registrado. Intenta con otro.';
          setError('email', {
            type: 'server',
            message: emailErrorMessage
          });
          toast.error(emailErrorMessage);
        } else if (error.response.status === 400 && responseData?.errors) {
          toast.error('Error de validación del backend. Por favor, revisa los campos.');
          for (const field in responseData.errors) {
            const fieldKey = field as keyof RegisterFormInputs;
            const message = responseData.errors[fieldKey];
            setError(fieldKey, { type: 'server', message });
          }
        } else {
          toast.error(`Error en el registro: ${errorMessage}`);
        }
      } else {
        toast.error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            {...register('firstName')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
            placeholder="Tu nombre"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            {...register('lastName')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
            placeholder="Tus apellidos"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
            placeholder="tu@correo.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
            placeholder="Crea tu contraseña"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 8 caracteres.
          </p>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            id="confirmarPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmarPassword')}
            className={`mt-1 block w-full px-3 py-2 border ${errors.confirmarPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
            placeholder="Repite tu contraseña"
          />
          {errors.confirmarPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmarPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="profesion" className="block text-sm font-medium text-gray-700">
            Profesión
          </label>
          <select
            id="profesion"
            {...register('profession')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.profession ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm rounded-md`}
          >
            <option value="" disabled>
              Selecciona tu profesión
            </option>
            <option value="NUTRITIONIST">Nutricionista</option>
            <option value="TRAINER">Entrenador</option>
          </select>
          {errors.profession && <p className="mt-1 text-xs text-red-600">{errors.profession.message}</p>}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="-ml-1 mr-3">
                <Spinner />
              </span>
              Registrando...
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm; 