import axios from 'axios';
import api from './api';
import type { SendEmailFormData, EmailResponse } from '../schemas/emailSchema';

// Interfaz para la petición al backend
interface SendPlanEmailRequest {
  patientId: number;
  recipientEmail: string;
  subject: string;
  message?: string;
  dietPlanId?: string;
  workoutPlanId?: string;
}

// Servicio para enviar planes por email
export const sendPlanEmail = async (
  patientId: number | string, 
  emailData: SendEmailFormData
): Promise<EmailResponse> => {
  try {
    const requestData: SendPlanEmailRequest = {
      patientId: typeof patientId === 'string' ? Number(patientId) : patientId,
      recipientEmail: emailData.recipientEmail,
      subject: emailData.subject,
      message: emailData.message,
      dietPlanId: emailData.dietPlanId,
      workoutPlanId: emailData.workoutPlanId,
    };

    const response = await api.post<EmailResponse>(`/patients/${requestData.patientId}/send-plans-email`, {
      recipientEmail: requestData.recipientEmail,
      subject: requestData.subject,
      bodyMessage: requestData.message,
      dietPlanId: requestData.dietPlanId ? String(requestData.dietPlanId) : undefined,
      workoutPlanId: requestData.workoutPlanId ? String(requestData.workoutPlanId) : undefined,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Extraer mensaje de error del backend si está disponible
      const message = (error.response.data as { message?: string })?.message 
        || 'Error al enviar el email';
      throw new Error(message);
    } else {
      throw new Error('Error de red o problema al conectar con el servidor.');
    }
  }
};

// Hook personalizado para el envío de emails (opcional, pero útil)
export const useEmailPlan = () => {
  return {
    sendEmail: sendPlanEmail,
  };
}; 