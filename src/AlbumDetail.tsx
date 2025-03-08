import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Styles/AlbumDetail.css';
import { usePlayer } from './PlayerContext';

interface Track{
    id: string;
    name: string;
    duration_ms: number;
}


interface Album {
    total_tracks: number;
    name: string;
    images: { url: string }[];
    release_date: string;
    artists: {
        id: string;
        name: string;
        type: string;
    }[];
    tracks:{items: Track[]};
}



const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
};

function AlbumDetail() {
    const {setSongId} = usePlayer();
    const { id, path, artistId} = useParams(); 
    const [album, setAlbum] = useState<Album | null>(null);
    const [totalDuration, setTotalDuration] = useState(0);
    const navigate = useNavigate();

    const handleClick = (id: string) => {
        setSongId(id);
      }

    useEffect(() => {

        fetch(`http://localhost:8080/albums/${id}`, {
            // mode:'no-cors'
        })
            .then(response => response.json())
            .then(data => {
                setAlbum(data);
                const totalMs = data.tracks.items.reduce((sum:number, track: Track) => sum + track.duration_ms, 0);
                setTotalDuration(totalMs);

            })
            .catch(error => console.error('Error fetching artist details:', error));

    }, [id]);

    const handleBack = () => {
        if(artistId){
            navigate(`/${path}/${artistId}`)
        } else{
            navigate(`/${path}`)
        }
    }
    return (
        <div className='album-page-container'>
            <button className='g-button' onClick={handleBack} >Back</button>
            <div className='album'>
                <div className='album-info'>
                <h2>{album?.name}</h2>
                <p><strong>Year:</strong>{album?.release_date.split("-")[0]}</p>
                <p><strong>Total songs:</strong>{album?.total_tracks}</p>
                <p><strong>Total duration:</strong>{formatDuration(totalDuration)}</p>
                <h3>Artist</h3>
                <p>{album?.artists.map(artist => artist.name).join(", ")}</p>
            </div>
            <div className='album-info-image'>
                <img src={album?.images[0].url} alt={album?.name} className='album-image' />
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
                    {album?.tracks.items.map((track, index) => (
                        <tr onClick={() => handleClick(track.id)} >
                            <td>{index + 1}</td>
                            <td>{track.name}</td>
                            <td>{formatDuration(track.duration_ms)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>

    )

}

export default AlbumDetail