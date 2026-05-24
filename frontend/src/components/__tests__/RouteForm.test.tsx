import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import RouteForm from '../RouteForm';

// Mocking AutocompleteInput to avoid loading Google Maps API inside JSDOM
vi.mock('../AutocompleteInput', () => ({
  default: ({ onChange, placeholder, value, onPlaceSelected }: any) => (
    <input
      data-testid="autocomplete-mock"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange(e);
        if (onPlaceSelected) onPlaceSelected(e.target.value);
      }}
    />
  ),
}));

describe('RouteForm Component', () => {
  it('renders correctly in default Origem-Destino mode', () => {
    render(<RouteForm onSubmit={vi.fn()} loading={false} />);
    
    expect(screen.getByText(/Planejar Rota/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Origem/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Destino/i)).toBeInTheDocument();
  });

  it('changes inputs when mode is changed to Base-Origem-Base', async () => {
    const user = userEvent.setup();
    render(<RouteForm onSubmit={vi.fn()} loading={false} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'base-origem-base');
    
    expect(screen.getByPlaceholderText(/Base/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Origem/i)).toBeInTheDocument();
    // Destino deve sumir nesse modo
    expect(screen.queryByPlaceholderText(/Destino/i)).not.toBeInTheDocument();
  });

  it('calls onSubmit with correct points when form is submitted', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<RouteForm onSubmit={handleSubmit} loading={false} />);
    
    const inputs = screen.getAllByTestId('autocomplete-mock');
    await user.type(inputs[0], 'Avenida Paulista');
    await user.type(inputs[1], 'Ibirapuera');
    
    const submitBtn = screen.getByRole('button', { name: /Calcular Rota/i });
    await user.click(submitBtn);
    
    expect(handleSubmit).toHaveBeenCalledWith(['Avenida Paulista', 'Ibirapuera']);
  });
});
