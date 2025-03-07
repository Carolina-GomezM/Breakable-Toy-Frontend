import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AlbumDetail from '../AlbumDetail';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

const mockAlbum = {
  total_tracks: 10,
  name: 'Mock Album',
  images: [{ url: 'http://example.com/mock-album.jpg' }],
  release_date: '2023-01-01',
  artists: [{ id: '1', name: 'Mock Artist', type: 'artist' }],
  tracks: {
    items: [
      { id: 'track1', name: 'Track 1', duration_ms: 180000 },
      { id: 'track2', name: 'Track 2', duration_ms: 200000 },
    ],
  },
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockAlbum),
  })
) as unknown as jest.Mock;

describe('AlbumDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('navega a la ruta correcta al hacer clic en el botón "Back"', async () => {
    render(
      <MemoryRouter initialEntries={['/album/1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mock Album')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/undefined');
  });

  test('muestra el nombre del álbum correctamente', async () => {
    render(
      <MemoryRouter initialEntries={['/album/1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mock Album')).toBeInTheDocument();
    });
  });

  test('renderiza la imagen del álbum con la fuente correcta', async () => {
    render(
      <MemoryRouter initialEntries={['/album/1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const albumImage = screen.getByAltText('Mock Album');
      expect(albumImage).toHaveAttribute('src', 'http://example.com/mock-album.jpg');
    });
  });

  test('muestra la lista de pistas correctamente', async () => {
    render(
      <MemoryRouter initialEntries={['/album/1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Track 1')).toBeInTheDocument();
      expect(screen.getByText('Track 2')).toBeInTheDocument();
    });
  });
});