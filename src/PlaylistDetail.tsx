import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Styles/AlbumDetail.css';
import { usePlayer } from './PlayerContext';

interface Playlist {
    id: string;
    tracks: {
        total: number;
        items: {
            track: {
                id: string;
                name: string;
                duration_ms: number;
            };
        }[];
    };
    name: string;
    images: { url: string }[];
    owner: {
        display_name: string;
        id: string;
    };
}

const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
};

function PlaylistDetail() {
    const {setSongId} = usePlayer();
    const { id, path, artistId } = useParams();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [totalDuration, setTotalDuration] = useState(0);
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setSongId(id);
      }

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://localhost:8080/playlist/${id}`);
                const data = await response.json();
                setPlaylist(data);

                const totalMs = data.tracks.items.reduce((sum: number, item: { track: { duration_ms: number } }) => sum + item.track.duration_ms, 0);
                setTotalDuration(totalMs);
            } catch (error) {
                console.error('Error fetching playlist details:', error);
            }
        };

        fetchPlaylist();
    }, [id]);

    const handleBack = () => {
        if (artistId) {
            navigate(`/${path}/${artistId}`);
        } else {
            navigate(`/${path}`);
        }
    };

    return (
        <div className='album-page-container'>
            <button className='g-button' onClick={handleBack}>Back</button>
            <div className='album'>
                <div className='album-info'>
                    <h2>{playlist?.name}</h2>
                    <p><strong>Owner:</strong> {playlist?.owner.display_name}</p>
                    <p><strong>Total songs:</strong> {playlist?.tracks.total}</p>
                    <p><strong>Total duration:</strong> {formatDuration(totalDuration)}</p>
                </div>
                <div className='album-info-image'>
                    {playlist?.images[0]?.url && (
                        <img src={playlist.images[0].url} alt={playlist.name} className='album-image' />
                    )}
                </div>
            </div>

            <h3>Songs</h3>
            <table className='track-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {playlist?.tracks.items.map((item, index) => (
                        <tr onClick={() => handleClick(item.track.id)} >
                            <td>{index + 1}</td>
                            <td>{item.track.name}</td>
                            <td>{formatDuration(item.track.duration_ms)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PlaylistDetail;