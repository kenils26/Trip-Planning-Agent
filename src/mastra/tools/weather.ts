import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Second tool, same 4-part pattern as the currency tool:
// id, description, inputSchema (Zod), execute.
export const getWeather = createTool({
  id: "get-weather",

  description:
    "Get the CURRENT weather conditions for a city. Call this when the user asks " +
    "what the weather is like right now in a destination, or whether to pack warm " +
    "or light clothes. Note: this returns current conditions, not a seasonal forecast.",

  inputSchema: z.object({
    city: z
      .string()
      .describe("City name, e.g. Goa, Manali, Jaipur, Mumbai"),
    // `.optional()` means Claude may leave this out. We default it to India below.
    countryCode: z
      .string()
      .length(2)
      .optional()
      .describe("Optional 2-letter ISO country code. Defaults to IN (India)."),
  }),

  outputSchema: z.object({
    city: z.string(),
    temperatureC: z.number(),
    feelsLikeC: z.number(),
    conditions: z.string(),
    humidityPercent: z.number(),
    windKph: z.number(),
  }),

  execute: async ({ city, countryCode }) => {
    // Read the API key from the environment (loaded from your .env file).
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENWEATHER_API_KEY is not set. Add it to your .env file.",
      );
    }

    // `?? "IN"` means: use countryCode if provided, otherwise fall back to "IN".
    const country = (countryCode ?? "IN").toUpperCase();
    const q = encodeURIComponent(`${city},${country}`);

    // units=metric gives temperatures in Celsius and wind speed in m/s.
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Could not find a city called "${city}".`);
      }
      if (res.status === 401) {
        throw new Error(
          "Weather API rejected the key (HTTP 401). A new OpenWeatherMap key can " +
            "take up to an hour to activate.",
        );
      }
      throw new Error(`Weather API request failed (HTTP ${res.status}).`);
    }

    const data = await res.json();

    return {
      city: data.name,
      temperatureC: data.main.temp,
      feelsLikeC: data.main.feels_like,
      conditions: data.weather?.[0]?.description ?? "unknown",
      humidityPercent: data.main.humidity,
      windKph: Math.round((data.wind?.speed ?? 0) * 3.6), // convert m/s -> km/h
    };
  },
});
