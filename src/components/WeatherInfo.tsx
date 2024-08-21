// src/components/WeatherInfo.tsx
import React from 'react';

interface WeatherInfoProps {
  data: {
    temp: number;
    humidity: number;
    weather: string;
    airQuality: number;
  };
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white border rounded shadow-lg">
      <h3 className="text-lg font-semibold">Weather Information</h3>
      <p><strong>Temperature:</strong> {data.temp}°C</p>
      <p><strong>Humidity:</strong> {data.humidity}%</p>
      <p><strong>Weather:</strong> {data.weather}</p>
      <p><strong>Air Quality Index:</strong> {data.airQuality}</p>
    </div>
  );
};

export default WeatherInfo;
