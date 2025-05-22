import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatientCard from './PatientCard';
import type { Patient } from '../../types/patient';

const mockPatient: Patient = {
  id: '123',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  professionalId: 'prof456',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  // Otros campos opcionales pueden ser añadidos si son relevantes para el renderizado
};

describe('PatientCard', () => {
  it('debería renderizar las iniciales, nombre completo y email del paciente', () => {
    const mockOnSelectPatient = vi.fn();
    render(<PatientCard patient={mockPatient} onSelectPatient={mockOnSelectPatient} />);

    // Verificar iniciales (J P)
    expect(screen.getByText('JP')).toBeInTheDocument(); 
    // Verificar nombre completo
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    // Verificar email
    expect(screen.getByText('juan.perez@example.com')).toBeInTheDocument();
  });

  it('debería renderizar el botón "Ver Perfil"', () => {
    const mockOnSelectPatient = vi.fn();
    render(<PatientCard patient={mockPatient} onSelectPatient={mockOnSelectPatient} />);
    expect(screen.getByRole('button', { name: /Ver Perfil/i })).toBeInTheDocument();
  });

  it('debería llamar a onSelectPatient con el ID del paciente cuando se hace clic en el botón "Ver Perfil"', () => {
    const mockOnSelectPatient = vi.fn();
    render(<PatientCard patient={mockPatient} onSelectPatient={mockOnSelectPatient} />);
    
    const viewProfileButton = screen.getByRole('button', { name: /Ver Perfil/i });
    fireEvent.click(viewProfileButton);
    
    expect(mockOnSelectPatient).toHaveBeenCalledOnce();
    expect(mockOnSelectPatient).toHaveBeenCalledWith(mockPatient.id);
  });

  it('debería llamar a onSelectPatient con el ID del paciente cuando se hace clic en cualquier parte de la tarjeta', () => {
    const mockOnSelectPatient = vi.fn();
    // El div principal tiene la clase "bg-white rounded-lg shadow-md..."
    // y un onClick, usaremos un testid para mayor robustez si es necesario, o un selector de clase.
    // Por ahora, asumamos que podemos obtenerlo por un rol o data-testid (si lo añadimos)
    // Vamos a usar el contenedor más externo que tiene el onClick y una clase distintiva
    render(<PatientCard patient={mockPatient} onSelectPatient={mockOnSelectPatient} />);
    
    // El div que contiene todo y tiene el onClick
    const cardElement = screen.getByText('Juan Pérez').closest('div.cursor-pointer'); 
    // Alternativamente, si tuviéramos un data-testid="patient-card-container" en el div principal:
    // const cardElement = screen.getByTestId('patient-card-container');
    
    expect(cardElement).toBeInTheDocument(); // Asegurarnos que lo encontramos
    if (cardElement) {
        fireEvent.click(cardElement);
        expect(mockOnSelectPatient).toHaveBeenCalledOnce();
        expect(mockOnSelectPatient).toHaveBeenCalledWith(mockPatient.id);
    }
  });

  it('debería renderizar solo las iniciales del nombre si el apellido no está disponible', () => {
    const patientWithoutLastName: Patient = {
      ...mockPatient,
      lastName: '', // Apellido vacío
    };
    const mockOnSelectPatient = vi.fn();
    render(<PatientCard patient={patientWithoutLastName} onSelectPatient={mockOnSelectPatient} />);
    
    expect(screen.getByText('J')).toBeInTheDocument(); // Solo inicial del nombre
    expect(screen.getByText('Juan')).toBeInTheDocument(); // Nombre completo sin apellido extra
  });

  it('debería no renderizar el email si no está disponible', () => {
    const patientWithoutEmail: Patient = {
      ...mockPatient,
      email: null, // Email nulo
    };
    const mockOnSelectPatient = vi.fn();
    render(<PatientCard patient={patientWithoutEmail} onSelectPatient={mockOnSelectPatient} />);
    
    expect(screen.queryByText('juan.perez@example.com')).not.toBeInTheDocument();
  });
}); 