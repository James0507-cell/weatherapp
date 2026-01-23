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

export async function getWeatherDataByCoords(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getDailyForecast(lat, lon) {
  try {
    // Note: This endpoint (forecast/daily) requires a paid subscription on OpenWeatherMap.
    // If using a free key, this might return 401.
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        // Fallback for free tier users who might not have access to /forecast/daily
        if (response.status === 401) {
             console.warn("Daily forecast API returned 401 (likely subscription issue). Falling back to 5-day/3-hour forecast.");
             return getFiveDayForecastFallback(lat, lon);
        }
        throw new Error("Failed to fetch daily forecast data");
    }

    return await response.json();
  } catch (error) {
    console.error("Forecast API Error:", error);
    throw error;
  }
}

async function getFiveDayForecastFallback(lat, lon) {
    // Fallback using the free 5-day/3-hour endpoint
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch fallback forecast");
    
    const data = await response.json();
    
    // Process 3-hour data to approximate daily forecast (taking noon value)
    const dailyData = [];
    const seenDates = new Set();
    
    for (const item of data.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!seenDates.has(date)) {
            seenDates.add(date);
            dailyData.push({
                dt: item.dt,
                temp: {
                    day: item.main.temp,
                    min: item.main.temp_min, // Approximate
                    max: item.main.temp_max  // Approximate
                },
                weather: item.weather
            });
        }
        if (dailyData.length === 7) break;
    }
    
    return { list: dailyData, city: data.city };
}

export async function getForecastData(city) {
  if (!city) return null;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Helper to get UNIX timestamp for X days ago
function getTimestampForDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return Math.floor(date.getTime() / 1000);
}

export async function getHistoricalData(lat, lon) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1); // Yesterday
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago

  const formatDate = (date) => date.toISOString().split('T')[0];
  
  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  // Using the requested Open-Meteo API with additional fields for the charts
  const url = `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startStr}&end_date=${endStr}&hourly=temperature_2m,relative_humidity_2m,rain`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.hourly || !data.hourly.time) {
        throw new Error("Invalid data format from Open-Meteo");
    }

    // Process hourly data into daily averages
    const dailyMap = {};
    
    data.hourly.time.forEach((timeStr, index) => {
        const dateStr = timeStr.split('T')[0];
        if (!dailyMap[dateStr]) {
            dailyMap[dateStr] = {
                temps: [],
                humidities: [],
                rains: 0
            };
        }
        dailyMap[dateStr].temps.push(data.hourly.temperature_2m[index]);
        dailyMap[dateStr].humidities.push(data.hourly.relative_humidity_2m[index]);
        dailyMap[dateStr].rains += data.hourly.rain[index] || 0;
    });

    const processedData = Object.keys(dailyMap).sort().map(date => {
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        const dayInfo = dailyMap[date];
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            avgTemp: parseFloat((dayInfo.temps.reduce((a, b) => a + b, 0) / dayInfo.temps.length).toFixed(1)),
            humidity: Math.round(dayInfo.humidities.reduce((a, b) => a + b, 0) / dayInfo.humidities.length),
            rainfall: parseFloat(dayInfo.rains.toFixed(1))
        };
    });

    return processedData;
  } catch (error) {
    console.error("Historical Data Error (Open-Meteo):", error);
    throw error;
  }
}

// Mock function to simulate historical data (since free API doesn't support history)
export function getMockHistoricalData(city) {
    const data = [];
    const today = new Date();
    
    // Generate 7 days of past data
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random variance based on a base temp of 25
        const baseTemp = 25;
        const randomTemp = baseTemp + (Math.random() * 10 - 5);
        
        data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            avgTemp: parseFloat(randomTemp.toFixed(1)),
            humidity: Math.floor(40 + Math.random() * 40),
            rainfall: parseFloat((Math.random() * 5).toFixed(1))
        });
    }
    return data;
}
