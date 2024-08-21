// LocationContext.tsx
"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Location {
  lat: number;
  lon: number;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
