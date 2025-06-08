import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DeleteConfirmationModal from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Eliminar elemento',
    message: '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.',
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mockear el body overflow para las pruebas
    Object.defineProperty(document.body.style, 'overflow', {
      value: '',
      writable: true
    });
  });

  afterEach(() => {
    // Limpiar eventos de teclado
    document.removeEventListener('keydown', expect.any(Function));
    // Restaurar overflow del body
    document.body.style.overflow = 'unset';
  });

  describe('rendering', () => {
    it('debería renderizar correctamente cuando está abierto', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Eliminar elemento')).toBeInTheDocument();
      expect(screen.getByText('¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirmar Eliminación' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });

    it('no debería renderizar cuando está cerrado', () => {
      const props = { ...defaultProps, isOpen: false };
      render(<DeleteConfirmationModal {...props} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('debería mostrar textos personalizados para los botones', () => {
      const props = {
        ...defaultProps,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'No, Cancelar'
      };
      render(<DeleteConfirmationModal {...props} />);
      
      expect(screen.getByRole('button', { name: 'Sí, Eliminar' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No, Cancelar' })).toBeInTheDocument();
    });

    it('debería mostrar el icono de advertencia', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      const warningIcon = screen.getByRole('dialog').querySelector('svg');
      expect(warningIcon).toBeInTheDocument();
    });

    it('debería tener las clases CSS correctas para el modal', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      const backdrop = screen.getByRole('dialog');
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
    });
  });

  describe('estado de carga', () => {
    it('debería mostrar spinner cuando está cargando', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Eliminación' });
      expect(confirmButton.querySelector('svg')).toBeInTheDocument(); // Spinner SVG
      expect(confirmButton).toBeDisabled();
    });

    it('debería deshabilitar botones cuando está cargando', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Eliminación' });
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      
      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('debería ocultar el botón de cerrar cuando está cargando', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      const closeButton = screen.queryByLabelText('Cerrar modal');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('debería aplicar estilos de carga a los botones', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Eliminación' });
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      
      expect(confirmButton).toHaveClass('bg-red-400', 'cursor-not-allowed');
      expect(cancelButton).toHaveClass('bg-gray-100', 'text-gray-400', 'cursor-not-allowed');
    });
  });

  describe('interacciones', () => {
    it('debería llamar onConfirm cuando se hace clic en confirmar', () => {
      const mockOnConfirm = vi.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm };
      render(<DeleteConfirmationModal {...props} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Eliminación' });
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledOnce();
    });

    it('debería llamar onClose cuando se hace clic en cancelar', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      render(<DeleteConfirmationModal {...props} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      fireEvent.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it('debería llamar onClose cuando se hace clic en el botón X', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      render(<DeleteConfirmationModal {...props} />);
      
      const closeButton = screen.getByLabelText('Cerrar modal');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it('debería llamar onClose cuando se hace clic en el backdrop', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      render(<DeleteConfirmationModal {...props} />);
      
      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);
      
      expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it('no debería cerrar cuando se hace clic en el contenido del modal', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      render(<DeleteConfirmationModal {...props} />);
      
      const modalContent = screen.getByText('Eliminar elemento').closest('div');
      fireEvent.click(modalContent!);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('no debería permitir interacciones cuando está cargando', () => {
      const mockOnConfirm = vi.fn();
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm, onClose: mockOnClose, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      const confirmButton = screen.getByRole('button', { name: 'Confirmar Eliminación' });
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      const backdrop = screen.getByRole('dialog');
      
      fireEvent.click(confirmButton);
      fireEvent.click(cancelButton);
      fireEvent.click(backdrop);
      
      expect(mockOnConfirm).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('manejo de teclado', () => {
    it('debería cerrar el modal cuando se presiona Escape', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      render(<DeleteConfirmationModal {...props} />);
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it('no debería cerrar cuando se presiona Escape mientras está cargando', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose, isLoading: true };
      render(<DeleteConfirmationModal {...props} />);
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('no debería cerrar cuando se presiona Escape si el modal está cerrado', () => {
      const mockOnClose = vi.fn();
      const props = { ...defaultProps, onClose: mockOnClose, isOpen: false };
      render(<DeleteConfirmationModal {...props} />);
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('accesibilidad', () => {
    it('debería tener los atributos ARIA correctos', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    });

    it('debería asociar correctamente el título y la descripción', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      const title = screen.getByText('Eliminar elemento');
      const description = screen.getByText('¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.');
      
      expect(title).toHaveAttribute('id', 'modal-title');
      expect(description).toHaveAttribute('id', 'modal-description');
    });

    it('debería tener label apropiado para el botón de cerrar', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      const closeButton = screen.getByLabelText('Cerrar modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('efectos secundarios', () => {
    it('debería prevenir el scroll del body cuando está abierto', () => {
      render(<DeleteConfirmationModal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('debería restaurar el scroll del body cuando se cierra', () => {
      const { rerender } = render(<DeleteConfirmationModal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<DeleteConfirmationModal {...defaultProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe('unset');
    });

    it('no debería afectar el body si el modal nunca se abre', () => {
      const props = { ...defaultProps, isOpen: false };
      render(<DeleteConfirmationModal {...props} />);
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('casos edge', () => {
    it('debería manejar títulos y mensajes muy largos', () => {
      const longTitle = 'Este es un título muy largo que podría causar problemas de layout en el modal';
      const longMessage = 'Este es un mensaje extremadamente largo que debería manejar correctamente el modal sin romper el diseño y manteniendo una buena experiencia de usuario incluso con contenido extenso.';
      
      const props = { ...defaultProps, title: longTitle, message: longMessage };
      render(<DeleteConfirmationModal {...props} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('debería manejar títulos y mensajes vacíos', () => {
      const props = { ...defaultProps, title: '', message: '' };
      render(<DeleteConfirmationModal {...props} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirmar Eliminación' })).toBeInTheDocument();
    });
  });
}); 