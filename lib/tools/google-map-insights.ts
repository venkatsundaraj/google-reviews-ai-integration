import { tool } from "ai";
import z from "zod";
import { env } from "@/env";

export const google_map_insights = function () {
  return tool({
    description:
      "Get insights from Google Maps reviews for restaurants, cafes, hotels, and attractions. " +
      "Use this when users ask about places to visit, restaurant recommendations, or reviews. " +
      "Can search for specific places OR browse restaurants in an area.",
    inputSchema: z.object({
      placeName: z
        .string()
        .optional()
        .describe(
          "The name of a specific place (e.g., 'Pizza Hut', 'Marina Beach'). Leave empty to browse restaurants in an area."
        ),
      location: z
        .string()
        .describe(
          "The city or area (e.g., 'Chennai', 'Adyar, Chennai', 'Mumbai')"
        ),
      type: z
        .enum(["restaurant", "cafe", "tourist_attraction", "hotel"])
        .optional()
        .describe("Type of place to search for when browsing an area"),
    }),
    execute: async ({ location, placeName, type = "restaurant" }) => {
      try {
        console.log(location, placeName, type);
        if (placeName) {
          console.log(placeName);
          const searchUrl = new URL(
            "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
          );
          searchUrl.searchParams.append("input", `${placeName} ${location}`);
          searchUrl.searchParams.append("inputtype", "textquery");
          searchUrl.searchParams.append("fields", "place_id,name");
          searchUrl.searchParams.append("key", env.GOOGLE_API_KEY);
          console.log("url", searchUrl);
          const searchResponse = await fetch(searchUrl.toString());
          const searchData = await searchResponse.json();

          if (!searchData.candidates?.length) {
            return { error: "Place not found" };
          }

          const placeId = searchData.candidates[0].place_id;

          // Get detailed info
          const detailsUrl = new URL(
            "https://maps.googleapis.com/maps/api/place/details/json"
          );
          detailsUrl.searchParams.append("place_id", placeId);
          detailsUrl.searchParams.append(
            "fields",
            "name,rating,user_ratings_total,reviews,formatted_address,types"
          );
          detailsUrl.searchParams.append("key", env.GOOGLE_API_KEY);

          const detailsResponse = await fetch(detailsUrl.toString());
          console.log("res", detailsResponse);
          const detailsData = await detailsResponse.json();
          console.log(detailsData);
          const place = detailsData.result;
          console.log(place);
          return {
            placeName: place.name,
            placeId: placeId,
            averageRating: place.rating,
            totalReviews: place.user_ratings_total,
            address: place.formatted_address,
            reviews: place.reviews?.map((review: any) => ({
              author: review.author_name,
              rating: review.rating,
              text: review.text,
              time: review.time,
              relativeTime: review.relative_time_description,
            })),
          };
        }

        const textSearchUrl = new URL(
          "https://maps.googleapis.com/maps/api/place/textsearch/json"
        );

        textSearchUrl.searchParams.append("query", `${type} in ${location}`);
        textSearchUrl.searchParams.append("key", env.GOOGLE_API_KEY);
        console.log("texturl", textSearchUrl);
        const textSearchResponse = await fetch(textSearchUrl.toString());
        console.log(textSearchResponse);
        const textSearchData = await textSearchResponse.json();
        console.log(textSearchData);
        if (!textSearchData.results?.length) {
          return { error: "No places found in this area" };
        }

        const places = textSearchData.results
          .slice(0, 10)
          .map((place: any) => ({
            placeName: place.name,
            placeId: place.place_id,
            averageRating: place.rating,
            totalReviews: place.user_ratings_total,
            address: place.formatted_address,
            priceLevel: place.price_level,
            isOpen: place.opening_hours?.open_now,
          }));
        console.log(places);
        return {
          searchType: "browse",
          location,
          type,
          totalFound: textSearchData.results.length,
          places,
        };
      } catch (error) {
        console.error("Google Maps API Error:", error);
        return { error: "Failed to fetch place details" };
      }
    },
  });
};
