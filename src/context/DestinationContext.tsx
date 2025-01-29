import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DestinationContextType {
  destination: string;
  setDestination: (destination: string) => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState('New York');

  return (
    <DestinationContext.Provider value={{ destination, setDestination }}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
}