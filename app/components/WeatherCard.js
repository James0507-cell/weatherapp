import Image from 'next/image';

export default function WeatherCard({ data, onSummarize }) {
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
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-6 flex flex-col items-center justify-between transition-all hover:scale-105 hover:shadow-2xl duration-300 w-full max-w-sm mx-auto">
      
      {/* AI Summarize Overlay Button */}
      {onSummarize && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center p-4">
              <button 
                  onClick={onSummarize}
                  className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-50 flex items-center gap-2"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Summarize & Suggest
              </button>
          </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{data.name}</h2>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">{description}</p>
      </div>
      
      <div className="relative w-32 h-32 my-4">
        <Image 
          src={iconUrl} 
          alt={description}
          fill
          className="object-contain drop-shadow-lg"
          unoptimized
        />
      </div>

      <div className="text-center mb-6">
        <span className="text-6xl font-extrabold text-gray-900">{temp}°</span>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 border-t border-gray-100 pt-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Humidity</span>
          <span className="text-base sm:text-lg font-bold text-gray-700">{humidity}%</span>
        </div>
        <div className="flex flex-col items-center border-l border-r border-gray-100 px-2">
           <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Wind</span>
           <span className="text-base sm:text-lg font-bold text-gray-700">{Math.round(windSpeed)} m/s</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">Feels Like</span>
           <span className="text-base sm:text-lg font-bold text-gray-700">{feelsLike}°</span>
        </div>
      </div>

      {/* Forecast Section */}
      {data.forecast && data.forecast.list && (
          <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">7-Day Forecast</h4>
              <div className="space-y-3">
                  {data.forecast.list.slice(0, 7).map((day, idx) => {
                      const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                      const dayIcon = day.weather?.[0]?.icon;
                      const dayIconUrl = dayIcon ? `https://openweathermap.org/img/wn/${dayIcon}.png` : '';
                      
                      return (
                          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center justify-between text-sm gap-2">
                              <span className="w-20 sm:w-24 text-gray-600 font-medium truncate">{date}</span>
                              <div className="flex items-center gap-2 flex-grow justify-center sm:justify-start">
                                  {dayIconUrl && <img src={dayIconUrl} alt="icon" className="w-8 h-8 object-contain" />}
                                  <span className="text-gray-500 capitalize text-xs hidden xs:block sm:block">{day.weather?.[0]?.description}</span>
                              </div>
                              <div className="flex gap-2 font-semibold text-gray-800">
                                  <span>{Math.round(day.temp.max || day.temp.day)}°</span>
                                  <span className="text-gray-400">{Math.round(day.temp.min || day.temp.day)}°</span>
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
