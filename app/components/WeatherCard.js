import Image from 'next/image';

export default function WeatherCard({ data }) {
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
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-6 flex flex-col items-center justify-between transition-transform hover:scale-105 duration-300 w-full max-w-sm mx-auto">
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

      <div className="w-full grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 font-semibold uppercase">Humidity</span>
          <span className="text-lg font-bold text-gray-700">{humidity}%</span>
        </div>
        <div className="flex flex-col items-center border-l border-r border-gray-100">
           <span className="text-xs text-gray-400 font-semibold uppercase">Wind</span>
           <span className="text-lg font-bold text-gray-700">{Math.round(windSpeed)} m/s</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-xs text-gray-400 font-semibold uppercase">Feels Like</span>
           <span className="text-lg font-bold text-gray-700">{feelsLike}°</span>
        </div>
      </div>
    </div>
  );
}
