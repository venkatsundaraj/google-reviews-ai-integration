import { MyUIMessage } from "@/types/chat";
import { tool, UIMessageStreamWriter } from "ai";
import "server-only";
import z from "zod";

export type Context = {
  writer: UIMessageStreamWriter;
  ctx: {
    totalMessages: MyUIMessage[];
    rawUserMessage: string;
  };
};
export const create_weather_tool = function ({ writer, ctx }: Context) {
  return tool({
    description:
      "Get current weather and forecast for a specific location using latitude and longitude coordinates. " +
      "Returns temperature, humidity, wind speed, and hourly forecasts.",

    inputSchema: z.object({
      latitude: z
        .number()
        .describe("Latitude of the location (e.g., 13.0827 for Chennai)"),
      longitude: z
        .number()
        .describe("Longitude of the location (e.g., 80.2707 for Chennai)"),
    }),

    execute: async ({ latitude, longitude }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${latitude}&` +
          `longitude=${longitude}&` +
          `current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&` +
          `hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&` +
          `timezone=auto&` +
          `forecast_days=1`
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to fetch weather data",
        };
      }

      const data = await response.json();
      console.log("weather", data);

      return {
        success: true,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
        },
        current: {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          units: {
            temperature: data.current_units.temperature_2m,
            windSpeed: data.current_units.wind_speed_10m,
          },
        },
        hourlyForecast: data.hourly.time
          .slice(0, 24)
          .map((time: string, i: number) => ({
            time,
            temperature: data.hourly.temperature_2m[i],
            humidity: data.hourly.relative_humidity_2m[i],
            windSpeed: data.hourly.wind_speed_10m[i],
          })),
      };
    },
  });
};
