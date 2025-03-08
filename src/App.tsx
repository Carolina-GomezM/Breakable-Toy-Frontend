import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Login';
import HomePage from './HomePage';
import ProtectedRoute from './ProtectedRoute'; 
import ArtistDetail from './ArtistDetail'
import AlbumDetail from './AlbumDetail'
import PlaylistDetail from './PlaylistDetail'
import PaginaE from './error';
import SpotifyPlayer from './SpotifyPlayer';
import { PlayerProvider } from './PlayerContext';
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-container">
      <div className="content">
        <Outlet />
      </div>
      <div className="spotify-player" >
      <SpotifyPlayer/>
      </div>
    </div>
  );
}


function App() {


  return (
    <Router>
      <PlayerProvider>
        <Routes>
            <Route path="/" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/artist/:id" element={<ProtectedRoute><ArtistDetail /></ProtectedRoute>} />
            <Route path="/album/:id/:path/:artistId?" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />
            <Route path="/playlist/:id/:path" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
            <Route path="/error" element={<PaginaE />} />
          </Route>
        </Routes>
      </PlayerProvider>
    </Router>
  );
}
export default App;