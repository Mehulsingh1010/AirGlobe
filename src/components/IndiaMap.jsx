"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import { useLocation } from './LocationContext'; 

const center = [20.5937, 78.9629];
const zoom = 6;

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.freepik.com/256/1784/1784926.png?semt=ais_hybrid',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const MapClickHandler = () => {
  const { setLocation } = useLocation();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const location = { lat, lon: lng };
      setLocation(location);
    }
  });

  return null;
};

const IndiaMap = () => {
  const { location } = useLocation();

  return (
    <div className="relative h-full w-full">
      {/* Text for mobile view */}
      <div className="block md:hidden text-green-300 text-center text-lg font-semibold my-2">
        Select a location and then open sidebar for more info! 
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 1 }} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {location && (
          <Marker position={[location.lat, location.lon]} icon={customIcon}>
            <Popup autoClose={false} closeOnClick={false}>
              <p>Coordinates: {location.lat}, {location.lon}</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
 
      <div className="absolute inset-0 flex items-center justify-center text-center text-white bg-gray-800 bg-opacity-70 rounded-lg md:hidden">
        <p className="text-lg font-semibold">Open sidebar to view details and pick a point first</p>
      </div>
    </div>
  );
};

export default IndiaMap;
