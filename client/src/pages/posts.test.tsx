import { render, screen, waitFor } from '@testing-library/react';
import Posts from './posts';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('Posts Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('displays loading spinner while fetching posts', () => {
    vi.spyOn(api, 'get').mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </MemoryRouter>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('displays posts when fetch is successful', async () => {
    const postData = [
      {
        id: 1,
        title: 'Test Post 1',
        content: 'Content 1',
        created_at: '2025-02-04T00:00:00Z',
      },
      {
        id: 2,
        title: 'Test Post 2',
        content: 'Content 2',
        created_at: '2025-03-05T00:00:00Z',
      },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: postData });

    render(
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Feb 4, 2025')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Test Post 1/i });
    expect(link).toHaveAttribute('href', '/posts/1');
  });

  test('displays error message when fetching posts fails', async () => {
    const errorMessage = 'Error fetching posts';
    vi.spyOn(api, 'get').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter initialEntries={['/posts']}>
        <Routes>
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
