"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function WeatherCard({ data, onSummarize }) {
  const [showOverlay, setShowOverlay] = useState(false);

  if (!data) return null;

  const iconCode = data.weather?.[0]?.icon;
  const iconUrl = iconCode 
    ? `https://openweathermap.org/img/wn/${iconCode}@4x.png`
    : '/images/Sunny.png';

  const temp = Math.round(data.main?.temp || 0);
  const description = data.weather?.[0]?.description || "Unknown";
  const humidity = data.main?.humidity || 0;
  const windSpeed = data.wind?.speed || 0;
  const feelsLike = Math.round(data.main?.feels_like || 0);

  return (
    <div 
        onClick={() => setShowOverlay(!showOverlay)}
        className="group relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100 flex flex-col transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] duration-500 w-full max-w-sm mx-auto cursor-pointer"
    >
      
      {/* Decorative Header Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-60 z-0"></div>

      {/* AI Summarize Overlay Button */}
      {onSummarize && (
          <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 z-20 flex items-center justify-center p-4 ${showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <button 
                  onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from toggling
                      onSummarize();
                  }}
                  className={`bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-2xl transform transition-all duration-300 hover:bg-indigo-50 hover:scale-105 flex items-center gap-2 ${showOverlay ? 'translate-y-0' : 'translate-y-8'}`}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>Summarize</span>
              </button>
          </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 flex flex-col items-center">
          <div className="text-center w-full mb-2">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{data.name}</h2>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mt-1">{description}</p>
          </div>
          
          <div className="relative w-40 h-40 my-2 filter drop-shadow-xl transition-transform duration-500 group-hover:scale-110">
            <Image 
              src={iconUrl} 
              alt={description}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="text-center mb-8">
            <span className="text-7xl font-black text-gray-800 tracking-tighter">{temp}°</span>
          </div>

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-3 transition-colors group-hover:bg-blue-50/50">
              <svg className="w-5 h-5 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Hum</span>
              <span className="text-lg font-bold text-gray-700">{humidity}%</span>
            </div>
            
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-3 transition-colors group-hover:bg-blue-50/50">
               <svg className="w-5 h-5 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
               </svg>
               {/* Note: using a simplified icon for wind/air here as a placeholder or generic */}
               <svg className="w-5 h-5 text-indigo-400 mb-1 absolute opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {/* Better wind icon */}
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
               {/* Actual Wind Icon */}
               <svg className="w-5 h-5 text-cyan-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Wind</span>
               <span className="text-lg font-bold text-gray-700">{Math.round(windSpeed)}<span className="text-xs align-top ml-0.5">m/s</span></span>
            </div>
            
            <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-3 transition-colors group-hover:bg-blue-50/50">
               <svg className="w-5 h-5 text-orange-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
               <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Feels</span>
               <span className="text-lg font-bold text-gray-700">{feelsLike}°</span>
            </div>
          </div>
      </div>

      {/* Forecast Section */}
      {data.forecast && data.forecast.list && (
          <div className="w-full bg-gray-50/50 p-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">7-Day Forecast</h4>
                  <span className="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">Daily</span>
              </div>
              
              <div className="space-y-2">
                  {data.forecast.list.slice(0, 7).map((day, idx) => {
                      const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      const dayIcon = day.weather?.[0]?.icon;
                      const dayIconUrl = dayIcon ? `https://openweathermap.org/img/wn/${dayIcon}.png` : '';
                      
                      return (
                          <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
                              <span className="w-24 text-gray-600 font-medium truncate">{date}</span>
                              <div className="flex items-center gap-2">
                                  {dayIconUrl && <img src={dayIconUrl} alt="icon" className="w-6 h-6 object-contain opacity-80" />}
                                  <span className="text-gray-400 text-xs hidden sm:block capitalize">{day.weather?.[0]?.description}</span>
                              </div>
                              <div className="flex items-center gap-3 font-semibold">
                                  <span className="text-gray-800">{Math.round(day.temp.max || day.temp.day)}°</span>
                                  <span className="text-gray-400 text-xs">{Math.round(day.temp.min || day.temp.day)}°</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
}