import "server-only";

import { tool } from "ai";
import z from "zod";

export const get_code = function () {
  return tool({
    description:
      "Convert a location name (city, address, etc.) into latitude and longitude coordinates. " +
      "Use this BEFORE calling the weather tool.",
    inputSchema: z.object({
      location: z
        .string()
        .describe(
          "The location name, city, or address (e.g., 'Chennai', 'Paris, France', 'New York City')"
        ),
    }),
    execute: async ({ location }) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}&limit=1`,
        {
          headers: {
            "User-Agent": "Simplifying Google Reviews/1.0",
          },
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to geocode location",
        };
      }

      const data = await response.json();
      console.log("code", data);

      if (!data || data.length === 0) {
        return {
          success: false,
          error: `Location "${location}" not found`,
        };
      }
      const result = data[0];

      return {
        success: true,
        location: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    },
  });
};
