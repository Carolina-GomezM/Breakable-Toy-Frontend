import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Styles/ArtistDetail.css';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from './PlayerContext';

interface Artist {
    name: string;
    images: { url: string }[];
    genres: string[];
    followers: { total: number };
    popularity: number;
}

interface Track {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    duration_ms: number;
    popularity: number;
}

interface Album {
        id: string;
        name: string;
        images: { url: string }[];
        release_date?: string;
    
  }

function ArtistDetail() {
    const { id } = useParams(); 
    const {setSongId} = usePlayer();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setSongId(id);
      }


    useEffect(() => {

        fetch(`http://localhost:8080/artists/${id}`)
            .then(response => response.json())
            .then(data => setArtist(data))
            .catch(error => console.error('Error fetching artist details:', error));

        fetch(`http://localhost:8080/artist/top-tracks/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); 
                if (data.tracks && Array.isArray(data.tracks)) {
                    setTopTracks(data.tracks);
                } else {
                    console.error("La respuesta no contiene un array de tracks:", data);
                }
            })
            .catch(error => console.error('Error fetching top tracks:', error));

        fetch(`http://localhost:8080/artist/album/${id}`)
        .then(response => response.json())
         .then(data => {
                console.log(data); 
                if (data.items && Array.isArray(data.items)) {
                    setAlbums(data.items);
                } else {
                    console.error("La respuesta no contiene un array de tracks:", data);
                }
            })
        .catch(error => console.error('Error fetching albums details:', error));


    }, [id]);

    if (!artist) return <p>Loading...</p>;

    const formatDuration = (durationMs: number) => {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = ((durationMs % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <div className='artist-detail-container'>
            <div className='banner'>
                <div className="image-container">
                    <img src={artist.images[0]?.url} alt={artist.name} className="artist-image-large" />
                    <div className='btn-container'>
                        <button className='g-button'
                        onClick={() => navigate(`/home`)} 
                        >Back</button>
                    </div>
                    <div className="artist-info">
                        <h1>{artist.name}</h1>
                        <p><strong>Genres:</strong> {artist.genres.join(', ')}</p>
                        <p><strong>Followers:</strong> {artist.followers.total.toLocaleString()}</p>
                        <p><strong>Popularity:</strong> {artist.popularity}/100</p>
                    </div>
                </div>
            </div>

            <div className="top-tracks">
                <h2>Top Tracks</h2>
                {topTracks.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Popularity</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topTracks.map((track, index) => (
                                <tr onClick={() => handleClick(track.id)} >
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={track.album.images[0]?.url} alt={track.name} className="track-image" />
                                    </td>
                                    <td>{track.name}</td>
                                    <td>{track.popularity}</td>
                                    <td>{formatDuration(track.duration_ms)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No tracks available.</p>
                )}
            </div>

            <div className='album-container-artist'>
            <h2>Albums</h2>
                {albums.length > 0 ? (
            <div className="album-grid-artist">
                {albums.map((album) => (
                <div key={album.id} className="album-card-artist" onClick={() => navigate(`/album/${album.id}/artist/${id}`)} >
                    <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="album-image-artist"
                    />
                    <div className='info'>
                    <h3>{album.name}</h3>
                    <p>
                    <strong>Realese date:</strong> {album.release_date}
                    </p>
                    </div>
                </div>
                ))}
          </div>
        ) : (
          <p>No albums available.</p>
        )}
      </div>
            </div>

    );
}

export default ArtistDetail;