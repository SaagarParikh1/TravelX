import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind, Loader } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherError {
  message: string;
}

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const Weather = () => {
  const { destination, setDestination } = useDestination();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(destination);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setDestination(newCity);
  };

  const convertToFahrenheit = (celsius: number) => {
    return Math.round((celsius * 9/5) + 32);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      
      try {
        setLoading(true);
        setError(null);

        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key') {
          throw new Error('Please configure your OpenWeather API key in the .env file');
        }

        const response = await axios.get(
          `${WEATHER_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        
        const data = response.data;
        
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          humidity: Math.round(data.main.humidity),
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('City not found. Please check the spelling and try again.');
        } else if (err.response?.status === 401) {
          setError('Please configure a valid OpenWeather API key in the .env file.');
        } else {
          const error = err as WeatherError;
          setError(error?.message || 'Failed to load weather data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000); // Update every 5 minutes

    return () => {
      clearInterval(weatherInterval);
    };
  }, [city]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Weather Information</h1>
          <p className="text-gray-600">Get real-time weather updates for {city}</p>
        </div>
        
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-6 py-4 text-lg border-2 border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Cloud className="h-6 w-6 text-sky-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
            <div className="flex items-center">
              <button
                onClick={() => setIsCelsius(true)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  isCelsius
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-sky-500'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setIsCelsius(false)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  !isCelsius
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-sky-500'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            {error}
          </div>
        ) : weather ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Temperature</h2>
                {weather.icon ? (
                  <img 
                    src={weather.icon}
                    alt={weather.condition}
                    className="h-16 w-16"
                  />
                ) : (
                  <Sun className="h-12 w-12 text-yellow-500" />
                )}
              </div>
              <p className="text-6xl font-bold text-sky-500 mb-2">
                {isCelsius ? weather.temperature : convertToFahrenheit(weather.temperature)}
                {isCelsius ? '°C' : '°F'}
              </p>
              <p className="text-gray-600 text-lg capitalize">{weather.condition}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Humidity</h2>
                <CloudRain className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-6xl font-bold text-sky-500 mb-2">{weather.humidity}%</p>
              <p className="text-gray-600 text-lg">Relative Humidity</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Wind Speed</h2>
                <Wind className="h-12 w-12 text-teal-500" />
              </div>
              <p className="text-6xl font-bold text-sky-500 mb-2">{weather.windSpeed} km/h</p>
              <p className="text-gray-600 text-lg">Current Wind Speed</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Weather;