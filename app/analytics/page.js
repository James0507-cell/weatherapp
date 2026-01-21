"use client";

import React, { useState } from 'react';
import { getForecastData, getMockHistoricalData, getHistoricalData, getWeatherData } from '../utils/api';
import SearchBar from '../components/SearchBar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AnalyticsPage() {
  const [city, setCity] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSearch = async (searchCity) => {
    setLoading(true);
    setCity(searchCity);
    setAiAnalysis(''); // Reset previous analysis
    
    try {
        // 1. Get coordinates first
        const weatherData = await getWeatherData(searchCity);
        if (!weatherData || !weatherData.coord) {
            throw new Error("City not found");
        }

        // 2. Fetch Historical Data (try real API first)
        let data = [];
        try {
            data = await getHistoricalData(weatherData.coord.lat, weatherData.coord.lon);
        } catch (apiError) {
            console.warn("Real historical API failed (likely free tier), falling back to mock data:", apiError);
            data = getMockHistoricalData(searchCity);
        }

        if (data.length === 0) {
            data = getMockHistoricalData(searchCity);
        }

        setHistoricalData(data);
        
        // 3. Trigger AI Analysis
        analyzeData(searchCity, data);

    } catch (error) {
        console.error("Analytics Error:", error);
        // Fallback completely to mock if even city search fails (or just show error)
        // For better UX, we might just show an error message, but here we'll try mock as last resort for demo
        const data = getMockHistoricalData(searchCity);
        setHistoricalData(data);
        analyzeData(searchCity, data);
    } finally {
        setLoading(false);
    }
  };

  const analyzeData = async (cityName, data) => {
      setIsAiLoading(true);
      try {
          const response = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  weatherData: { name: cityName }, // Minimal context for the generic route
                  query: `Analyze this historical weather data for ${cityName} and provide 3 key insights or trends: ${JSON.stringify(data)}. Format as a concise list.`
              }),
          });
          const result = await response.json();
          setAiAnalysis(result.text);
      } catch (err) {
          setAiAnalysis("Unable to generate analysis at this time.");
      } finally {
          setIsAiLoading(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Weather Analytics</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore historical weather trends and get AI-powered insights.
          <br/>
          <span className="text-xs text-gray-400 italic">(Using Open-Meteo Historical Forecast Data)</span>
        </p>
      </div>

      <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
          <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      )}

      {!loading && historicalData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {/* Charts Section */}
              <div className="lg:col-span-2 space-y-8">
                  {/* Temperature Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Temperature Trend (Last 7 Days)</h3>
                      <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={historicalData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} unit="°C" />
                                  <Tooltip 
                                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                  />
                                  <Legend />
                                  <Line 
                                      type="monotone" 
                                      dataKey="avgTemp" 
                                      name="Avg Temp" 
                                      stroke="#2563eb" 
                                      strokeWidth={3} 
                                      dot={{r: 4, fill: '#2563eb', strokeWidth: 0}} 
                                      activeDot={{r: 6}} 
                                  />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Humidity & Rainfall Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Humidity & Rainfall</h3>
                      <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={historicalData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} unit="%" />
                                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} unit="mm" />
                                  <Tooltip 
                                      cursor={{fill: '#f3f4f6'}}
                                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                  />
                                  <Legend />
                                  <Bar yAxisId="left" dataKey="humidity" name="Humidity (%)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                  <Bar yAxisId="right" dataKey="rainfall" name="Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* AI Analysis Sidebar */}
              <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 h-full border border-indigo-100 sticky top-24">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                      </div>

                      {isAiLoading ? (
                          <div className="space-y-4 animate-pulse">
                              <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                              <div className="h-4 bg-indigo-200 rounded w-full"></div>
                              <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                          </div>
                      ) : (
                          <div className="prose prose-indigo prose-sm text-gray-700">
                              {aiAnalysis ? (
                                  <div className="whitespace-pre-line">{aiAnalysis}</div>
                              ) : (
                                  <p className="text-gray-500 italic">Analysis will appear here...</p>
                              )}
                          </div>
                      )}
                      
                      <div className="mt-8 pt-6 border-t border-indigo-100">
                          <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Powered by Gemini AI</p>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
