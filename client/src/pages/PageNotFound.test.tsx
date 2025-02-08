import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageNotFound from './PageNotFound';

describe('PageNotFound Component', () => {
  test('renders 404, Page Not Found text and a Go Home link', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();

    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();

    const goHomeLink = screen.getByRole('link', { name: /Go Home/i });
    expect(goHomeLink).toBeInTheDocument();
    expect(goHomeLink.getAttribute('href')).toBe('/posts');
  });
});
