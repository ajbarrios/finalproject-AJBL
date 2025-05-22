import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Habilitar timers falsos para controlar setTimeout
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Limpiar mocks y restaurar timers reales
    vi.useRealTimers(); 
  });

  it('debería renderizar el input con el placeholder y valor inicial correctos', () => {
    const mockOnSearchChange = vi.fn();
    const initialTerm = 'test inicial';
    const placeholderText = 'Buscar aquí...';

    render(
      <SearchBar 
        currentSearchTerm={initialTerm} 
        onSearchChange={mockOnSearchChange} 
        placeholder={placeholderText} 
      />
    );

    const inputElement = screen.getByPlaceholderText(placeholderText) as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe(initialTerm);
  });

  it('debería actualizar el valor del input al escribir', () => {
    const mockOnSearchChange = vi.fn();
    render(<SearchBar currentSearchTerm="" onSearchChange={mockOnSearchChange} />);
    
    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'nuevo término' } });
    
    expect(inputElement.value).toBe('nuevo término');
  });

  it('no debería llamar a onSearchChange inmediatamente al escribir', () => {
    const mockOnSearchChange = vi.fn();
    const debounceDelay = 500;
    render(<SearchBar currentSearchTerm="" onSearchChange={mockOnSearchChange} debounceDelay={debounceDelay} />);
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'hola' } });
    
    expect(mockOnSearchChange).not.toHaveBeenCalled();
  });

  it('debería llamar a onSearchChange después del debounceDelay con el último valor escrito', () => {
    const mockOnSearchChange = vi.fn();
    const debounceDelay = 500;
    render(<SearchBar currentSearchTerm="" onSearchChange={mockOnSearchChange} debounceDelay={debounceDelay} />);
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'hola' } });
    
    // Avanzar el tiempo por el debounceDelay
    vi.advanceTimersByTime(debounceDelay);
    
    expect(mockOnSearchChange).toHaveBeenCalledOnce();
    expect(mockOnSearchChange).toHaveBeenCalledWith('hola');
  });

  it('debería llamar a onSearchChange solo una vez si se escribe varias veces dentro del debounceDelay', () => {
    const mockOnSearchChange = vi.fn();
    const debounceDelay = 500;
    render(<SearchBar currentSearchTerm="" onSearchChange={mockOnSearchChange} debounceDelay={debounceDelay} />);
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'h' } });
    vi.advanceTimersByTime(debounceDelay / 2); // Avanzar menos del delay
    fireEvent.change(inputElement, { target: { value: 'ho' } });
    vi.advanceTimersByTime(debounceDelay / 2);
    fireEvent.change(inputElement, { target: { value: 'hol' } });
    vi.advanceTimersByTime(debounceDelay / 2);
    fireEvent.change(inputElement, { target: { value: 'hola' } });
    
    expect(mockOnSearchChange).not.toHaveBeenCalled(); // Aún no debe llamarse
    
    vi.advanceTimersByTime(debounceDelay); // Avanzar el tiempo restante para el último cambio
    
    expect(mockOnSearchChange).toHaveBeenCalledOnce();
    expect(mockOnSearchChange).toHaveBeenCalledWith('hola');
  });

  it('debería limpiar el timeout si el componente se desmonta antes del debounce', () => {
    const mockOnSearchChange = vi.fn();
    const debounceDelay = 500;
    const { unmount } = render(
      <SearchBar currentSearchTerm="" onSearchChange={mockOnSearchChange} debounceDelay={debounceDelay} />
    );
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'test' } });
    
    unmount(); // Desmontar el componente
    
    vi.advanceTimersByTime(debounceDelay); // Avanzar el tiempo
    
    expect(mockOnSearchChange).not.toHaveBeenCalled(); // No debería haberse llamado
  });

  it('debería actualizar el inputValue si currentSearchTerm cambia desde el padre', () => {
    const mockOnSearchChange = vi.fn();
    const initialTerm = 'inicial';
    const { rerender } = render(
      <SearchBar currentSearchTerm={initialTerm} onSearchChange={mockOnSearchChange} />
    );

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    expect(inputElement.value).toBe(initialTerm);

    const updatedTermFromParent = 'actualizado por padre';
    rerender(
      <SearchBar currentSearchTerm={updatedTermFromParent} onSearchChange={mockOnSearchChange} />
    );

    expect(inputElement.value).toBe(updatedTermFromParent);
    // No debería llamar a onSearchChange solo por la actualización de la prop si el valor no ha sido modificado por el usuario
    expect(mockOnSearchChange).not.toHaveBeenCalled(); 
  });

}); 