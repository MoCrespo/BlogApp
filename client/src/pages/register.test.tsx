import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './register';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('Register Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('renders registration form with all required fields', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Register/i })
    ).toBeInTheDocument();
  });

  test('submits the form successfully and calls API with correct data', async () => {
    const mockPost = vi
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: { token: 'dummy-token' } });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('auth/register', {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message when registration fails', async () => {
    const errorMessage = 'Registration failed';
    vi.spyOn(api, 'post').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('displays error message when passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter username/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), {
      target: { value: 'differentpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});
