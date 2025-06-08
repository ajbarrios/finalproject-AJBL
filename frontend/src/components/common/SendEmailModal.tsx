import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendEmailSchema, type SendEmailFormData } from '../../schemas/emailSchema';
import { sendPlanEmail } from '../../services/emailService';
import toast from 'react-hot-toast';
import PlanSelector from '../email/PlanSelector';
import AlertMessage from '../email/AlertMessage';
import EmailFormFields from '../email/EmailFormFields';
import ActionButtons from '../email/ActionButtons';
import { usePlanSelection } from '../../hooks/usePlanSelection';
import type { SendEmailModalProps } from '../../types/emailTypes';

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  onSendSuccess,
  patientId,
  patientName,
  patientEmail,
  professionalName = 'Dr. Profesional',
  availablePlans
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    selectedDietPlans,
    selectedWorkoutPlans,
    handleDietPlanChange,
    handleWorkoutPlanChange,
    initializeWithActivePlans,
    resetSelection,
    hasSelectedPlans
  } = usePlanSelection({ availablePlans });

  // Configuración del formulario con react-hook-form
  const {
    register,
    formState: { errors },
    reset,
  } = useForm<SendEmailFormData>({
    resolver: zodResolver(sendEmailSchema),
  });

  // Manejar tecla Escape y overflow del body
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Reset del formulario cuando se abre el modal
      reset({
        recipientEmail: patientEmail || '',
        subject: `Planes personalizados - ${patientName}`,
        message: `Hola ${patientName},

Te adjunto tus planes personalizados.

Si tienes dudas, no dudes en contactarme.

Saludos,
${professionalName}`,
      });
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose, reset, patientEmail, patientName, professionalName]);

  // Efecto separado para inicializar planes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      initializeWithActivePlans();
    }
  }, [isOpen, initializeWithActivePlans]);

  // Manejar envío del formulario
  const onSubmit = async (data: SendEmailFormData) => {
    // Validar que al menos un plan esté seleccionado
    if (!hasSelectedPlans) {
      toast.error('Debes seleccionar al menos un plan para enviar');
      return;
    }

    setIsLoading(true);
    try {
      // Enviar con el primer plan seleccionado de cada tipo (por ahora el backend solo soporta uno de cada tipo)
      const emailData = {
        ...data,
        dietPlanId: selectedDietPlans.length > 0 ? selectedDietPlans[0] : undefined,
        workoutPlanId: selectedWorkoutPlans.length > 0 ? selectedWorkoutPlans[0] : undefined,
      };
      
      await sendPlanEmail(patientId, emailData);
      toast.success('Email enviado correctamente');
      onSendSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el email';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevenir el cierre al hacer clic fuera del modal
    event.preventDefault();
  };

  const handleClose = () => {
    if (!isLoading) {
      // Resetear selecciones al cerrar
      resetSelection();
      onClose();
    }
  };

  // Submit handler manual para casos donde react-hook-form falle
  const handleManualSubmit = async () => {
    // Obtener valores directamente del DOM
    const recipientEmail = (document.getElementById('recipientEmail') as HTMLInputElement)?.value;
    const subject = (document.getElementById('subject') as HTMLInputElement)?.value;
    const message = (document.getElementById('message') as HTMLTextAreaElement)?.value;
    
    // Validación básica
    if (!recipientEmail || !subject) {
      toast.error('Por favor, completa los campos obligatorios');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      toast.error('Por favor, introduce un email válido');
      return;
    }
    
    // Llamar a la función de envío
    await onSubmit({
      recipientEmail,
      subject,
      message: message && message.trim() !== '' ? message : undefined,
      dietPlanId: selectedDietPlans.length > 0 ? selectedDietPlans[0] : undefined,
      workoutPlanId: selectedWorkoutPlans.length > 0 ? selectedWorkoutPlans[0] : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 
              id="modal-title"
              className="text-lg font-semibold text-gray-900 flex items-center"
            >
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Planes por Email
            </h3>
            {!isLoading && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="px-6 py-4 space-y-6">
          {/* Alerta cuando no hay email del paciente */}
          <AlertMessage show={!patientEmail} />

          {/* Selector de planes */}
          <PlanSelector 
            availablePlans={availablePlans}
            selectedDietPlans={selectedDietPlans}
            selectedWorkoutPlans={selectedWorkoutPlans}
            onDietPlanChange={handleDietPlanChange}
            onWorkoutPlanChange={handleWorkoutPlanChange}
          />

          {/* Campos del formulario */}
          <EmailFormFields 
            register={register}
            errors={errors}
            isLoading={isLoading}
            patientEmail={patientEmail}
          />



          {/* Botones de acción */}
          <ActionButtons 
            isLoading={isLoading}
            hasSelectedPlans={hasSelectedPlans}
            onCancel={handleClose}
            onSubmit={handleManualSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal; 