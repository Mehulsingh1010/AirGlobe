// utils/api.ts

const API_KEY = 'ea66840a6ce817001bfd3af7f9342559';

export const fetchCities = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(query)}&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Extract city names from the API response
    const cities = data.list.map((item: any) => item.name);
    
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const fetchWeather = async (city: string): Promise<any> => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      weather_condition: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};
