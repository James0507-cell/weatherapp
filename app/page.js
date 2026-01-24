"use client";

import React, { useState, useEffect } from "react";
import { getWeatherData, getWeatherDataByCoords, getDailyForecast } from "./utils/api";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localWeather, setLocalWeather] = useState(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherDataByCoords(latitude, longitude);
            
            let forecastData = null;
            try {
              forecastData = await getDailyForecast(latitude, longitude);
            } catch (e) {
              console.error("Forecast fetch failed", e);
            }
            
            setLocalWeather({ ...data, forecast: forecastData });
          } catch (error) {
            console.error("Error getting local weather:", error);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  }, []);
  
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    try {
      const currentData = await getWeatherData(city);
      
      let forecastData = null;
      if (currentData.coord) {
          try {
              forecastData = await getDailyForecast(currentData.coord.lat, currentData.coord.lon);
          } catch (e) {
              console.error("Forecast fetch failed", e);
          }
      }

      setWeatherList((prev) => [{ ...currentData, forecast: forecastData }, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const askAssistant = async (e) => {
    e.preventDefault();
    if (!query || weatherList.length === 0) return;

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData: weatherList[0],
          query: query
        }),
      });
      const data = await response.json();
      setAiResponse(data.text);
    } catch (err) {
      setAiResponse("Sorry, I couldn't connect to the AI assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSummarize = async (data) => {
      const prompt = "Summarize the weather conditions and suggest 3 suitable activities.";
      setQuery(prompt);
      setIsAiLoading(true);
      
      try {
          const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  weatherData: data, 
                  query: prompt
              }),
          });
          const result = await response.json();
          setAiResponse(result.text);
      } catch (err) {
          setAiResponse("Unable to generate summary.");
      } finally {
          setIsAiLoading(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Check the Weather <span className="text-blue-600">Instantly</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter a city name to get accurate, real-time weather data and AI insights.
        </p>
        <div className="mt-8">
            <SearchBar onSearch={handleSearch} />
        </div>
        {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg max-w-md mx-auto border border-red-200">
                {error}
            </div>
        )}
      </div>

      {isLocating && (
        <div className="flex justify-center py-4">
          <span className="text-gray-500 animate-pulse">Detecting location...</span>
        </div>
      )}
      
      {localWeather && (
        <div className="mb-12">
           <div className="flex items-center justify-center gap-2 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Your Location</h3>
           </div>
           <div className="flex justify-center">
             <WeatherCard 
                data={localWeather} 
                onSummarize={() => handleSummarize(localWeather)}
             />
           </div>
        </div>
      )}

      {loading && (
          <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      )}

      {weatherList.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8">
              {weatherList.map((data, index) => (
                  <WeatherCard 
                      key={`${data.name}-${index}`} 
                      data={data} 
                      onSummarize={() => handleSummarize(data)}
                  />
              ))}
          </div>
      )}
      
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mt-16 transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">Weather Assistant</h3>
                  <p className="text-gray-500">Ask questions about the current weather conditions.</p>
              </div>
              <div className="mt-4 md:mt-0 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
                  Powered by Gemini
              </div>
          </div>
          
          <div className="space-y-6">
              {aiResponse && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl animate-in fade-in slide-in-from-left-4 duration-500">
                      <p className="text-gray-800 leading-relaxed italic">&quot;{aiResponse}&quot;</p>
                  </div>
              )}

              <form onSubmit={askAssistant} className="flex flex-col sm:flex-row gap-4">
                  <input 
                      type="text"
                      className="w-full sm:flex-grow p-3 sm:p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      placeholder={weatherList.length > 0 ? "Should I bring an umbrella?" : "Search for a city first..."}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={weatherList.length === 0 || isAiLoading}
                  />
                  <button 
                      type="submit"
                      disabled={weatherList.length === 0 || isAiLoading}
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                      {isAiLoading ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : "Ask AI"}
                  </button>
              </form>
          </div>
      </section>
    </div>
  );
}