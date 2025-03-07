import React, { createContext, useState, useContext } from 'react';

interface PlayerContextType {
  songId: string | null;
  setSongId: (songId: string) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songId, setSongId] = useState<string | null>(null);

  return (
    <PlayerContext.Provider value={{ songId, setSongId}}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de un PlayerProvider');
  }
  return context;
};