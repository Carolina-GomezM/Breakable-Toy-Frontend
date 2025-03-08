import { useState } from 'react';
import './Styles/Login.css';


import normalButtonImage from './assets/Btn1.png'; 
import hoverButtonImage from './assets/Btn2.png';   

function App() {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    fetch("http://localhost:8080/auth/spotify", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'text/plain' 
          },
    //   mode:'no-cors'
    }).then(res => (res.text())).then(response => (window.location.href=String(response)))
    }
  

  return (
    <div className="container">
      <h1 className='title'>Login to Spotify!</h1>
      <button
        onClick={handleLogin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="spotify-login-button"
      >
        <img
          src={isHovered ? hoverButtonImage : normalButtonImage}
          alt="Login with Spotify"
          className="button-image"
        />
      </button>
    </div>
  );
}

export default App;