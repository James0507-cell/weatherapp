import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          About <span className="text-blue-600">Weatherlytics</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A modern, intelligent weather dashboard designed to give you more than just the temperature. 
          Combine real-time data with AI-driven insights to make better decisions.
        </p>
      </section>

      {/* How it Works / Usage */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">1. Instant Weather Check</h3>
                <p className="text-gray-600">
                    Simply enter a city name on the <span className="font-bold text-blue-600">Home</span> page to get current conditions (temperature, humidity, wind) and a 7-day forecast.
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">2. Ask the Assistant</h3>
                <p className="text-gray-600">
                    Not sure what to wear? Use the <span className="font-bold text-green-600">AI Assistant</span> box below the weather cards to ask questions like &quot;Is it safe to go jogging?&quot; or &quot;Should I water my plants?&quot;
                </p>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">3. Historical Analytics</h3>
                <p className="text-gray-600">
                    Visit the <span className="font-bold text-indigo-600">Analytics</span> page to view trends from the past 7 days, including temperature fluctuations and rainfall data, visualized with interactive charts.
                </p>
            </div>
        </div>
      </section>

      {/* Resources & Technologies */}
      <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Powered By</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* OpenWeatherMap */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">OpenWeatherMap</h3>
                  <p className="text-sm text-gray-700 mb-4">
                      Provides the real-time weather data and the upcoming 7-day forecast displayed on the home page.
                  </p>
                  <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded text-orange-800">API: Current & Forecast</span>
              </div>

              {/* Open-Meteo */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Open-Meteo</h3>
                  <p className="text-sm text-gray-700 mb-4">
                      Powers the historical data analytics, allowing us to fetch past weather conditions without authentication barriers.
                  </p>
                  <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded text-blue-800">API: Historical Forecast</span>
              </div>

              {/* Google Gemini */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl border border-indigo-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Google Gemini</h3>
                  <p className="text-sm text-gray-700 mb-4">
                      The intelligence behind the &quot;Weather Assistant.&quot; It analyzes weather context to provide human-like advice and insights.
                  </p>
                  <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded text-indigo-800">Model: Gemini 2.5 Flash</span>
              </div>

          </div>
      </section>

      {/* Footer / Tech Stack */}
      <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
              Built with Next.js 16, Tailwind CSS, and Recharts.
          </p>
      </div>
    </div>
  );
}
