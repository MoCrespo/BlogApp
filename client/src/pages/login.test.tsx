import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './login';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('Login Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('renders login form with email, password fields and login button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits the form and calls API with correct data', async () => {
    const mockPost = vi
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: { token: 'dummy-token' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    vi.spyOn(api, 'post').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'fail@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
