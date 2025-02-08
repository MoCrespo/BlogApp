import { render, screen, waitFor } from '@testing-library/react';
import PostDetail from './postDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('PostDetail Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('displays loading spinner while fetching post', () => {
    vi.spyOn(api, 'get').mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/posts/1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('displays post details when fetched successfully', async () => {
    const postData = {
      id: 1,
      title: 'Test Post Title',
      content: 'Test post content for the post detail page',
      created_at: '2025-02-04T00:00:00Z',
    };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: postData });

    render(
      <MemoryRouter initialEntries={['/posts/1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(postData.title)).toBeInTheDocument();
    });

    expect(screen.getByText('Feb 4, 2025')).toBeInTheDocument();

    expect(screen.getByText(postData.content)).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Back to Posts/i })
    ).toBeInTheDocument();
  });

  test('displays error message when fetching post fails', async () => {
    const errorMessage = 'Error fetching post details';
    vi.spyOn(api, 'get').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter initialEntries={['/posts/1']}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
