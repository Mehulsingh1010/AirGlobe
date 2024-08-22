import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from './LocationContext'; // Adjust the path as needed
import { FaSun, FaCloudRain, FaCloud, FaCloudShowersHeavy, FaSnowflake, FaWind } from 'react-icons/fa';
import { CloudRain } from 'lucide-react';

const apiKey ='ea66840a6ce817001bfd3af7f9342559'
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
  Clear: <FaSun size={20} />,
  Clouds: <FaCloud size={20} />,
  Rain: <CloudRain size={20} />,
  Drizzle: <FaCloudShowersHeavy size={20} />,
  Snow: <FaSnowflake size={20} />,
  Wind: <FaWind size={20} />
};

const Details: React.FC = () => {
  const { location } = useLocation();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (location) {
      fetchDetails(location.lat, location.lon);
    } else {
      setData(null);
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

  const renderWeatherIcon = (condition: string) => {
    return weatherIcons[condition] || <FaCloud size={20} />;
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg mt-4">
      <div className="bg-blue-500 dark:bg-blue-700 text-white text-lg font-semibold p-3 rounded-lg">
        Weather Details
      </div>
      <div className="p-4">
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!location && !data && !loading && !error && (
          <p className="text-gray-600 dark:text-gray-400 text-center">Select a location to get details.</p>
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
