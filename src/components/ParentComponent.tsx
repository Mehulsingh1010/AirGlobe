// ParentComponent.tsx
import React, { useState } from 'react';
import IndiaMap from './IndiaMap';
import { Menu } from './admin-panel/menu';

const ParentComponent: React.FC = () => {
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lon: number } | null>(null);

  const handleLocationClick = (location: { lat: number; lon: number }) => {
    setClickedLocation(location);
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <Menu location={clickedLocation} />
      </div>
      <div className="w-3/4">
        <IndiaMap onLocationClick={handleLocationClick} />
      </div>
    </div>
  );
};

export default ParentComponent;
