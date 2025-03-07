export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('http://localhost:8080/refresh-token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken } = await response.json();

    console.log(accessToken);

    localStorage.setItem('accessToken', JSON.stringify(accessToken));

    window.dispatchEvent(new CustomEvent('accessTokenChanged', { detail: accessToken }));

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);

    localStorage.removeItem('accessToken');

    window.dispatchEvent(new CustomEvent('accessTokenChanged', { detail: null }));

    return null;
  }
};


  export const access_token = async () => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/get-tokens');
        const data = await response.json();
        return data.accessToken;
      } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
      }
    };

    const token = await fetchAccessToken()

    localStorage.setItem('accessToken',token);

  }
  


  export const fetchWithAuthRetry = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    let response = await fetch(input, init);
  
    if (response.status === 401) {
      console.log("entre")
      const newAccessToken = await refreshToken();
  
      if (newAccessToken) {
        response = await fetch(input, init);
      }
    }
  
    return response;
  };