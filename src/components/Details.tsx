import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSun, FaCloudRain, FaCloud, FaCloudShowersHeavy, FaSnowflake, FaWind } from 'react-icons/fa';
import { CloudRain } from 'lucide-react';

const apiKey = 'ea66840a6ce817001bfd3af7f9342559';
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
  Wind: <FaWind size={24} />,
};

const Details: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

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
          units: 'metric',
        },
      });
      setData(response.data);
    } catch (error) {
      setError('Unable to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const renderWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <FaCloud size={24} />;
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-6">
      <div className="bg-blue-600 dark:bg-blue-700 text-white text-xl font-semibold py-3 px-4 rounded-t-lg">
        Weather Details
      </div>
      <div className="px-4 py-5">
        <button
          onClick={handleFindLocation}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded mb-6"
        >
          Find My Current Location
        </button>
        {loading && <p className="text-gray-500 dark:text-gray-400 text-center">Loading...</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
        {!location && !data && !loading && !error && (
          <p className="text-gray-600 dark:text-gray-400 text-center">Select a location to get details.</p>
        )}
        {data && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Location:</h3>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Place:</strong> {data.name}, {data.sys.country}
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Coordinates:</strong> {data.coord.lat}, {data.coord.lon}
              </p>
            </div>

            <div className="space-y-1 border-t border-gray-300 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Weather:</h3>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <strong>Temperature:</strong> {data.main.temp}°C
                </p>
                {renderWeatherIcon(data.weather[0].main)}
              </div>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Condition:</strong> {data.weather[0].description}
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Humidity:</strong> {data.main.humidity}%
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Pressure:</strong> {data.main.pressure} hPa
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong className="text-blue-600 dark:text-blue-400">Wind Speed:</strong> {data.wind.speed} m/s
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
