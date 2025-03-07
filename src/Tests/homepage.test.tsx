import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import HomePage from '../HomePage' 

global.fetch = vi.fn()

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  }
})

vi.mock('../assets/tree.gif', () => ({ default: 'mock-tree-gif' }))
vi.mock('../assets/disco.jpeg', () => ({ default: 'mock-disco-jpeg' }))
vi.mock('../assets/hearth.gif', () => ({ default: 'mock-hearth-gif' }))

describe('HomePage Component', () => {
  const mockTopArtists = [
    {
      id: '1',
      name: 'Artist 1',
      images: [{ url: 'http://example.com/artist1.jpg' }],
      genres: ['Rock']
    },
    {
      id: '2', 
      name: 'Artist 2',
      images: [{ url: 'http://example.com/artist2.jpg' }],
      genres: ['Pop']
    }
  ]

  const mockSearchResults = {
    artists: {
      items: [
        {
          id: '3',
          name: 'Search Artist',
          images: [{ url: 'http://example.com/search-artist.jpg' }],
          genres: ['Jazz']
        }
      ]
    },
    albums: {
      items: [
        {
          id: 'album1',
          name: 'Search Album',
          images: [{ url: 'http://example.com/search-album.jpg' }],
          release_date: '2023-01-01'
        }
      ]
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders top artists on initial load', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTopArtists
    } as Response)

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
      expect(screen.getByText('Artist 2')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/me/top/artists')
  })

  test('performs search and displays results', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTopArtists
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResults
      } as Response)

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar artistas, álbumes, canciones o playlists...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })

    await waitFor(() => {
      const searchArtistElement = screen.queryByText('Search Artist')
      const searchAlbumElement = screen.queryByText('Search Album')
      
      expect(searchArtistElement).toBeInTheDocument()
      expect(searchAlbumElement).toBeInTheDocument()
    }, { timeout: 2000 })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/search?query='),
      expect.objectContaining({ method: 'GET', mode: 'cors' })
    )
  })

  test('navigates to artist details when artist card is clicked', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTopArtists
    } as Response)

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const artistCards = screen.getAllByText(/Artist/)
      expect(artistCards.length).toBeGreaterThan(0)
    })

    const firstArtistCard = screen.getByText('Artist 1')
    fireEvent.click(firstArtistCard)

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/artist/1')
  })
})