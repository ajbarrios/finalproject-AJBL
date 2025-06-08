import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SendEmailFormData } from '../../schemas/emailSchema';

interface EmailFormFieldsProps {
  register: UseFormRegister<SendEmailFormData>;
  errors: FieldErrors<SendEmailFormData>;
  isLoading: boolean;
  patientEmail?: string;
}

const EmailFormFields: React.FC<EmailFormFieldsProps> = ({
  register,
  errors,
  isLoading,
  patientEmail
}) => {
  return (
    <>
      {/* Campo Email del destinatario */}
      <div>
        <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email del destinatario *
          {patientEmail && (
            <span className="text-xs text-green-600 ml-2 font-normal">
              (Email del paciente)
            </span>
          )}
        </label>
        <input
          id="recipientEmail"
          type="email"
          {...register('recipientEmail')}
          disabled={isLoading || !!patientEmail}
          readOnly={!!patientEmail}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.recipientEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' : patientEmail ? 'bg-green-50' : 'bg-white'}
            ${patientEmail ? 'cursor-default' : ''}
          `}
          placeholder={patientEmail ? `${patientEmail} (Email del paciente)` : "email@ejemplo.com"}
        />
        {patientEmail && (
          <p className="mt-1 text-xs text-green-600 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Se enviará automáticamente al email del paciente
          </p>
        )}
        {errors.recipientEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.recipientEmail.message}</p>
        )}
      </div>

      {/* Campo Asunto */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Asunto *
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          disabled={isLoading}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          placeholder="Asunto del email"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Campo Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje (opcional)
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          disabled={isLoading}
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical
            ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          placeholder="Mensaje personal para el paciente..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>
    </>
  );
};

export default EmailFormFields; 