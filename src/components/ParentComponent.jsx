import React, { useState } from 'react';
import IndiaMap from './IndiaMap';
import { Menu } from './admin-panel/menu';

const ParentComponent = () => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // You can control this based on your logic

  const handleLocationClick = (location) => {
    setClickedLocation(location);
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <Menu isOpen={isMenuOpen} location={clickedLocation} />
      </div>
      <div className="w-3/4">
        <IndiaMap onLocationClick={handleLocationClick} />
      </div>
    </div>
  );
};

export default ParentComponent;
