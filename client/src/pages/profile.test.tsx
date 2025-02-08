import { render, screen, waitFor } from '@testing-library/react';
import Profile from './profile';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('Profile Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  test('displays loading spinner while fetching profile', () => {
    vi.spyOn(api, 'get').mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('displays profile data when fetched successfully', async () => {
    const profileData = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
    };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: profileData });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    expect(screen.getByText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();

    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText('testuser@example.com')).toBeInTheDocument();

    const editButton = screen.getByRole('link', { name: /Edit Profile/i });
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('href', '/profile/edit');

    const newPostButton = screen.getByRole('link', { name: /New Post/i });
    expect(newPostButton).toBeInTheDocument();
    expect(newPostButton).toHaveAttribute('href', '/posts/new');
  });

  test('displays error message when fetching profile fails', async () => {
    const errorMessage = 'Error fetching profile';
    vi.spyOn(api, 'get').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
