import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import axios from 'axios';

const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeatherAndAirStatus(city) {
  try {
    const weatherResponse = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const weatherData = weatherResponse.data;
    return {
      weatherDescription: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
      airQuality: weatherData.main.pressure,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Unable to fetch weather information.");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userInput, city } = body;

    if (!userInput || !city) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const weatherData = await getWeatherAndAirStatus(city);

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: `You are Sam, a friendly assistant who works for AirGlobe...` }],
        },
        {
          role: "model",
          parts: [{ text: `Hello! Welcome to AirGlobe...` }],
        },
      ],
    });

    const result = await chat.sendMessage(
      `The current weather in ${city} is ${weatherData.weatherDescription}, ` +
      `with a temperature of ${weatherData.temperature}°C. ` +
      `The air quality pressure is at ${weatherData.airQuality} hPa. ` +
      `Based on this information, please respond to: ${userInput}`
    );

    return new Response(
      JSON.stringify({ response: result.response.text() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
