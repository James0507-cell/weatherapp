"use client";

import React, { useState } from "react";
import { getWeatherData, getDailyForecast } from "./utils/api";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // AI Assistant State
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    try {
      const currentData = await getWeatherData(city);
      
      // Fetch forecast using coordinates
      let forecastData = null;
      if (currentData.coord) {
          try {
              forecastData = await getDailyForecast(currentData.coord.lat, currentData.coord.lon);
          } catch (e) {
              console.error("Forecast fetch failed", e);
          }
      }

      // Store combined data
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
          weatherData: weatherList[0], // Ask about the most recently searched city
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero / Search Section */}
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

      {/* Loading State */}
      {loading && (
          <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      )}

      {/* Weather Cards Grid */}
      {weatherList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {weatherList.map((data, index) => (
                  <WeatherCard key={`${data.name}-${index}`} data={data} />
              ))}
          </div>
      )}
      
      {/* Weather Assistant / AI Section */}
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

              <form onSubmit={askAssistant} className="flex gap-4">
                  <input 
                      type="text"
                      className="flex-grow p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      placeholder={weatherList.length > 0 ? "Should I bring an umbrella?" : "Search for a city first..."}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={weatherList.length === 0 || isAiLoading}
                  />
                  <button 
                      type="submit"
                      disabled={weatherList.length === 0 || isAiLoading}
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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