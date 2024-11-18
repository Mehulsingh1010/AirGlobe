/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSun, FaCloudRain, FaCloud, FaCloudShowersHeavy, FaSnowflake, FaWind } from 'react-icons/fa';
import { CloudRain } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useLocation } from './LocationContext'; // Adjust the path as needed

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
  name: string;
  sys: { country: string };
  coord: { lat: number; lon: number };
  main: { temp: number; humidity: number; pressure: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
}

const weatherIcons: Record<string, JSX.Element> = {
  Clear: <FaSun size={24} />,
  Clouds: <FaCloud size={24} />,
  Rain: <CloudRain size={24} />,
  Drizzle: <FaCloudShowersHeavy size={24} />,
  Snow: <FaSnowflake size={24} />,
  Wind: <FaWind size={24} />
};

const Details: React.FC = () => {
  const { location, setLocation } = useLocation();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [showFindMyLocation, setShowFindMyLocation] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      fetchDetails(location.lat, location.lon);
    }
  }, [location]);

  const fetchDetails = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<WeatherData>(apiEndpoint, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      });
      setData(response.data);
    } catch (error) {
      setError("Unable to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setSelectedPosition([lat, lng]);
    setLocation({ lat, lon: lng });
    setShowFindMyLocation(false); 
    fetchDetails(lat, lng); 
  };

  const handleFindMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });  // Sets location in context
        setSelectedPosition([latitude, longitude]);
        setShowFindMyLocation(true);
        fetchDetails(latitude, longitude);
      }, (err) => {
        setError("Failed to retrieve location.");
      });
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  

  const renderWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <FaCloud size={24} />;
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg mt-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={handleFindMyLocation}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Find My Location
        </button>
      </div>
      
      <div className="p-4">
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && !data && !selectedPosition && (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Click on the map or use "Find My Location" to get details.
          </p>
        )}
        {data && (
          <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4 rounded-b-lg">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Location:</h3>
            <p className="mb-2"><strong className="text-blue-600 dark:text-blue-400">Place:</strong> {data.name}, {data.sys.country}</p>
            <p className="mb-2"><strong className="text-blue-600 dark:text-blue-400">Coordinates:</strong> {data.coord.lat}, {data.coord.lon}</p>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">Weather:</h3>
              <div className="flex items-center mb-2">
                <p className="text-lg font-semibold mr-2"><strong>Temperature:</strong> {data.main.temp}°C</p>
                {renderWeatherIcon(data.weather[0].main)}
              </div>
              <p className="mb-2"><strong className="text-blue-600 dark:text-blue-400">Weather Condition:</strong> {data.weather[0].description}</p>
              <p className="mb-2"><strong className="text-blue-600 dark:text-blue-400">Humidity:</strong> {data.main.humidity}%</p>
              <p className="mb-2"><strong className="text-blue-600 dark:text-blue-400">Pressure:</strong> {data.main.pressure} hPa</p>
              <p><strong className="text-blue-600 dark:text-blue-400">Wind Speed:</strong> {data.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
