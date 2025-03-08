import React, { useEffect, useState } from 'react';
import { usePlayer } from './PlayerContext'; 
import './Styles/SpotifyPlayer.css'
import { fetchWithAuthRetry } from './auth';
import { access_token } from './auth';



const SpotifyPlayer: React.FC = () => {
  const { songId } = usePlayer();  
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const storedValue = localStorage.getItem('accessToken');
    return storedValue ? storedValue : null;
  });
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume] = useState<number>(50);



  useEffect(() => {
    const handleAccessTokenChange = (event: CustomEvent) => {
      setAccessToken(event.detail);
    };

    window.addEventListener('accessTokenChanged', handleAccessTokenChange as EventListener);

    return () => {
      window.removeEventListener('accessTokenChanged', handleAccessTokenChange as EventListener);
    };
  }, []);

  

  useEffect(() => {
    access_token();


    const initializePlayer = async () => {
      const token = accessToken;
      console.log(token +"mitoken")
      if (token) {
        setAccessToken(token);
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: 'Mi Reproductor de Spotify',
            getOAuthToken: (cb: (token: string) => void) => {
              cb(token);
            },
            volume: volume / 100,
          });

          player.addListener('ready', ({ device_id }: { device_id: string }) => {
            setDeviceId(device_id);
          });

          player.addListener('player_state_changed', (state: any) => {
            if (state) {
              setIsPaused(state.paused);
              setCurrentTrack(state.track_window.current_track);
            }
          });

          player.connect();
        };
      }
    };

      initializePlayer();

  }, [accessToken, localStorage]);

  useEffect(() => {
    if (songId && accessToken && deviceId) {
      playTrack(`spotify:track:${songId}`);
  }
  }, [songId, accessToken, deviceId]);


  const playTrack = async (trackUri: string) => {
    if (accessToken && deviceId) {

      try {
        await fetchWithAuthRetry(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // mode:'no-cors'
        });
      } catch (error) {
        console.error('Error al reproducir la pista:', error);
      }
    }
  };

  const togglePlayPause = async () => {
    const endpoint = isPaused
      ? `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`
      : 'https://api.spotify.com/v1/me/player/pause';
    if (accessToken && deviceId) {
      try {
        await fetchWithAuthRetry(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // mode:'no-cors'
        });
        setIsPaused(!isPaused);
      } catch (error) {
        console.error('Error al alternar reproducción/pausa:', error);
      }
    }
  };

  return (
    <div className="spotify-player">
      {currentTrack && (
        <>
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="bg-image"
          />
          <div className="content">
            <img
              src={currentTrack.album.images[0].url}
              alt={currentTrack.name}
              className="inline-image"
            />
            <p>{currentTrack.name}</p>
            <p>{currentTrack.artists.map((artist: { name: any; }) => artist.name).join(', ')}</p>
            <button onClick={togglePlayPause}>
              {isPaused ? '▶' : '❚❚'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SpotifyPlayer;