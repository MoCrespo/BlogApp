import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewPost from './NewPost';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../api/api';

describe('NewPost Page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders new post form with title and content inputs and a submit button', () => {
    render(
      <MemoryRouter>
        <NewPost />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/Enter post title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter post content/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Post/i })
    ).toBeInTheDocument();
  });

  test('submits the form successfully and shows success message', async () => {
    const mockPost = vi
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: { id: 1 } });

    render(
      <MemoryRouter>
        <NewPost />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/Enter post title/i);
    const contentInput = screen.getByPlaceholderText(/Enter post content/i);
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, {
      target: { value: 'Test content for the new post' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('posts', {
        title: 'Test Title',
        content: 'Test content for the new post',
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Post created successfully/i)
      ).toBeInTheDocument();
    });
  });

  test('displays error message when new post submission fails', async () => {
    const errorMessage = 'Error creating post';
    vi.spyOn(api, 'post').mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    render(
      <MemoryRouter>
        <NewPost />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/Enter post title/i);
    const contentInput = screen.getByPlaceholderText(/Enter post content/i);
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, {
      target: { value: 'Test content for the new post' },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
