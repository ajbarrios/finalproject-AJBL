import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EmailFormFields from '../EmailFormFields';
import { sendEmailSchema, type SendEmailFormData } from '../../../schemas/emailSchema';

// Componente wrapper para testing que incluye el contexto de react-hook-form
const TestWrapper = ({ patientEmail, isLoading = false }: { patientEmail?: string; isLoading?: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useForm<SendEmailFormData>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      recipientEmail: patientEmail || '',
      subject: 'Test Subject',
      message: 'Test Message',
    },
  });

  return (
    <EmailFormFields
      register={register}
      errors={errors}
      isLoading={isLoading}
      patientEmail={patientEmail}
    />
  );
};

describe('EmailFormFields', () => {
  it('debería renderizar todos los campos del formulario', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/email del destinatario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
  });

  it('debería mostrar asteriscos para campos obligatorios', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/email del destinatario \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asunto \*/i)).toBeInTheDocument();
    // El mensaje es opcional, no debería tener asterisco
    expect(screen.getByLabelText(/mensaje \(opcional\)/i)).toBeInTheDocument();
  });

  it('debería configurar el campo de email como readonly cuando hay patientEmail', () => {
    render(<TestWrapper patientEmail="patient@test.com" />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i) as HTMLInputElement;
    expect(emailInput).toHaveAttribute('readonly');
    expect(emailInput).toBeDisabled();
    expect(emailInput.value).toBe('patient@test.com');
  });

  it('debería permitir editar el campo de email cuando no hay patientEmail', () => {
    render(<TestWrapper />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i) as HTMLInputElement;
    expect(emailInput).not.toHaveAttribute('readonly');
    expect(emailInput).not.toBeDisabled();
  });

  it('debería mostrar texto indicativo cuando hay email del paciente', () => {
    render(<TestWrapper patientEmail="patient@test.com" />);
    
    expect(screen.getByText('(Email del paciente)')).toBeInTheDocument();
    expect(screen.getByText(/se enviará automáticamente al email del paciente/i)).toBeInTheDocument();
  });

  it('debería tener placeholder correcto para email sin paciente', () => {
    render(<TestWrapper />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    expect(emailInput).toHaveAttribute('placeholder', 'email@ejemplo.com');
  });

  it('debería tener placeholder personalizado cuando hay email del paciente', () => {
    render(<TestWrapper patientEmail="patient@test.com" />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    expect(emailInput).toHaveAttribute('placeholder', 'patient@test.com (Email del paciente)');
  });

  it('debería deshabilitar todos los campos cuando isLoading es true', () => {
    render(<TestWrapper isLoading={true} />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    const subjectInput = screen.getByLabelText(/asunto/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    
    expect(emailInput).toBeDisabled();
    expect(subjectInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
  });

  it('debería tener las clases CSS correctas para el estado de loading', () => {
    render(<TestWrapper isLoading={true} />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    expect(emailInput).toHaveClass('bg-gray-100', 'cursor-not-allowed');
  });

  it('debería tener las clases CSS correctas para email del paciente', () => {
    render(<TestWrapper patientEmail="patient@test.com" />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    expect(emailInput).toHaveClass('bg-green-50', 'cursor-default');
  });

  it('debería mostrar el icono de check cuando hay email del paciente', () => {
    const { container } = render(<TestWrapper patientEmail="patient@test.com" />);
    
    // Buscar el SVG del check mark
    const checkIcon = container.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('debería configurar el textarea con el número correcto de filas', () => {
    render(<TestWrapper />);
    
    const messageTextarea = screen.getByLabelText(/mensaje/i);
    expect(messageTextarea).toHaveAttribute('rows', '6');
  });

  it('debería tener placeholders apropiados', () => {
    render(<TestWrapper />);
    
    const subjectInput = screen.getByLabelText(/asunto/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    
    expect(subjectInput).toHaveAttribute('placeholder', 'Asunto del email');
    expect(messageInput).toHaveAttribute('placeholder', 'Mensaje personal para el paciente...');
  });

  it('debería tener los tipos de input correctos', () => {
    render(<TestWrapper />);
    
    const emailInput = screen.getByLabelText(/email del destinatario/i);
    const subjectInput = screen.getByLabelText(/asunto/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(subjectInput).toHaveAttribute('type', 'text');
    expect(messageInput.tagName.toLowerCase()).toBe('textarea');
  });

  it('debería tener los IDs correctos para los campos', () => {
    render(<TestWrapper />);
    
    expect(screen.getByLabelText(/email del destinatario/i)).toHaveAttribute('id', 'recipientEmail');
    expect(screen.getByLabelText(/asunto/i)).toHaveAttribute('id', 'subject');
    expect(screen.getByLabelText(/mensaje/i)).toHaveAttribute('id', 'message');
  });
}); 