import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { weatherData, query } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let contextPart = "";
    if (weatherData) {
        if (weatherData.main && weatherData.weather) {
             // Full current weather context
             contextPart = `Context: The current weather in ${weatherData.name} is ${weatherData.main.temp}°C, with ${weatherData.weather[0].description} and ${weatherData.main.humidity}% humidity.`;
        } else if (weatherData.name) {
             // Minimal context (e.g. for analytics where data is in the query)
             contextPart = `Context: Analyzing weather data for ${weatherData.name}.`;
        }
    }




    const prompt = `
      You are a helpful and witty weather assistant. 
      ${contextPart}
      
      User Request: ${query}
      
      Provide a concise, helpful response based on the context and request.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
