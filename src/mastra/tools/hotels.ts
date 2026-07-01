import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { HOTELS } from "../data/hotels";

export const searchHotels = createTool({
  id: "search-hotels",

  description:
    "Find hotels in a city with their nightly price (in ₹) and rating. Call this " +
    "when the user asks where to stay or wants hotel options for a destination. " +
    "Optionally cap the results to a maximum price per night to respect a budget.",

  inputSchema: z.object({
    city: z.string().describe("City to find hotels in, e.g. Goa, Jaipur"),
    maxPricePerNight: z
      .number()
      .positive()
      .optional()
      .describe("Optional budget cap: only return hotels at or below this ₹/night"),
  }),

  outputSchema: z.object({
    count: z.number(),
    currency: z.string(),
    hotels: z.array(
      z.object({
        name: z.string(),
        city: z.string(),
        area: z.string(),
        pricePerNight: z.number(),
        rating: z.number(),
      }),
    ),
  }),

  execute: async ({ city, maxPricePerNight }) => {
    const c = city.trim().toLowerCase();

    const hotels = HOTELS.filter((h) => {
      const cityMatch = h.city.toLowerCase() === c;
      const withinBudget =
        maxPricePerNight === undefined || h.pricePerNight <= maxPricePerNight;
      return cityMatch && withinBudget;
    })
      // Best-rated first.
      .sort((a, b) => b.rating - a.rating);

    return { count: hotels.length, currency: "INR", hotels };
  },
});
