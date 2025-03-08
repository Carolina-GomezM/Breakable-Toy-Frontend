import { useEffect, useState } from 'react';
import './Styles/homePage.css';
import { useNavigate } from 'react-router-dom';

import gif from './assets/tree.gif'
import imagePlaylist from './assets/disco.jpeg'
import hearth from './assets/hearth.gif'
import { usePlayer } from './PlayerContext';
import { access_token } from './auth';


interface Image {
  url: string;
}

interface Artist {
  id: string;
  name: string;
  images: Image[];
  genres?: string[];
}

interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date?: string;
}

interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  explicit: boolean;
}

interface Playlist {
  id: string;
  name: string;
  images: Image[];
  owner?: { display_name: string };
}

interface SearchResults {
  artists?: { items: Artist[] };
  albums?: { items: Album[] };
  tracks?: { items: Track[] };
  playlists?: { items: Playlist[] };
}

const HomePage = () => {
  const {setSongId} = usePlayer();
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    setSongId(id);
  }

  useEffect(() => {
    access_token();
    fetch('http://localhost:8080/me/top/artists', {
      // mode:'no-cors'
    })

      .then(response => response.json())
      .then(data => setTopArtists(data))
      .catch(error => console.error('Error fetching top artists:', error));
  }, []);

  async function Search(query: string) {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const encodedQuery: string = encodeURIComponent(query);

    try {
      const response = await fetch(`http://localhost:8080/search?query=${encodedQuery}`, {
        method: 'GET',
        // mode:'no-cors'
      });
      if (!response.ok) throw new Error('Error in the search');

      const data: SearchResults = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error in the search:', error);
    }
  }

  return (
      <div className="home-page">
        <img src={gif} alt="" className='gif gif-1' />
        <img src={hearth} alt="" className='gif gif-3' />

    <div className='all'>
      <input 
        type="text" 
        id="searchBar" 
        placeholder="Search by artists, albums, tracks, playlists..."
        onChange={(e) => Search(e.target.value)}
      />

      <h1 className="Title-top-artists">Top Artists</h1>

      <div className="artists-container">
        {topArtists.map((artist) => (
          <div 
          key={artist.id} 
          className="artist-card" 
          onClick={() => navigate(`/artist/${artist.id}`)} 
          style={{ cursor: 'pointer' }}
          >
            <img src={artist.images[0]?.url} alt={artist.name} className="artist-image" />
            <h2>{artist.name}</h2>
            <p>{artist.genres?.join(', ')}</p>
          </div>
        ))}
      </div>

        <h1 className='search-title'>Search</h1>
      <div className='search-results-container'>

      {searchResults && (
        <>
          {searchResults.artists && searchResults.artists.items.length > 0 && (
            <>
              <div className="artists-container-search">
                <h1>Arists</h1>
                {searchResults.artists.items.map((artist) => (
                  <div 
                    key={artist.id} 
                    className="artist-card-search" 
                    onClick={() => navigate(`/artist/${artist.id}`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={artist.images[0]?.url} alt={artist.name} className="artist-image-search" />
                    <h2>{artist.name}</h2>
                    <p>{artist.genres?.join(', ')}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {searchResults.albums && searchResults.albums.items.length > 0 && (
            <>
              <div className="albums-container">
              <h1>Albums</h1>
                {searchResults.albums.items.map((album) => (
                  <div 
                    key={album.id} 
                    className="album-card" 
                    onClick={() => navigate(`/album/${album.id}/home`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={album.images[0]?.url} alt={album.name} className="album-image" />
                    <h2>{album.name}</h2>
                    <p>{album.release_date}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {searchResults.tracks && searchResults.tracks.items.length > 0 && (
            <>
              <div className="tracks-container">
              <h1>Tracks</h1>
                {searchResults.tracks.items.map((track) => (
                  <div 
                    key={track.id} 
                    className="track-card" 
                    onClick={() => handleClick(track.id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={track.album.images[0]?.url} alt={track.name} className="track-image" />
                    <h2>{track.name}</h2>
                    <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </>
          )}

{searchResults.playlists && searchResults.playlists.items.length > 0 && (
  <>
    <div className="playlists-container">
        <h1>Playlists</h1>
      {searchResults.playlists.items.map((playlist) => {
          if (!playlist) {
              return null;
            }
            
            return (
                <div 
                key={playlist.id} 
                className="playlist-card" 
                onClick={() => navigate(`/playlist/${playlist.id}/home`)} 
                style={{ cursor: 'pointer' }}
                >
            <img 
              src={playlist.images?.[0]?.url || imagePlaylist} 
              alt={playlist.name} 
              className="playlist-image" 
              />
            <h2>{playlist.name}</h2>
            <p>Owner: {playlist.owner?.display_name}</p>
          </div>
        );
      })}
      
    </div>
    
  </>
)}

        </>
      )}
    </div>
    </div>
    <img src="" alt="" className='gif gif-2' />
    </div>
  );
}


export default HomePage;