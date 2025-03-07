import { JSX, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/check-auth');
        const data = await response.json();
        setIsAuthenticated(data);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />; 
  }

  return children;
}

export default ProtectedRoute;