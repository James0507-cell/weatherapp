"use client";

import React, { useState } from "react";
import { getWeatherData } from "./utils/api";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    try {
      const data = await getWeatherData(city);
      // Avoid duplicates if needed, or just append
      setWeatherList((prev) => [data, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
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
          Enter a city name to get accurate, real-time weather data.
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
      
      {/* Weather Assistant / AI Section (Placeholder for future features) */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">Weather Assistant</h3>
                  <p className="text-gray-500">Get AI-powered insights about your weather.</p>
              </div>
              <span className="mt-4 md:mt-0 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Coming Soon</span>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">AI Insights panel will appear here</p>
          </div>
      </section>
    </div>
  );
}
