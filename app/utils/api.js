const API_KEY = "9a6fd318d662efe64c2ac02db927c8c3"; // In a real app, use process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

export async function getWeatherData(city) {
  if (!city) return null;
  
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found");
        }
        throw new Error("Failed to fetch weather data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
