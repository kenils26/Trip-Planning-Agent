import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { FLIGHTS } from "../data/flights";

export const searchFlights = createTool({
  id: "search-flights",

  description:
    "Get flight options and fares (in ₹) between two airports. Call this when the " +
    "user asks about flights, airfares, or how to fly between two places. Requires " +
    "3-letter IATA airport codes (DEL = Delhi, BOM = Mumbai, GOI = Goa, " +
    "BLR = Bengaluru, JAI = Jaipur) — infer the code from the city the user names.",

  inputSchema: z.object({
    from: z.string().length(3).describe("3-letter IATA code to depart FROM, e.g. DEL"),
    to: z.string().length(3).describe("3-letter IATA code to fly TO, e.g. GOI"),
    date: z.string().describe("Travel date as YYYY-MM-DD, e.g. 2026-12-20"),
  }),

  outputSchema: z.object({
    count: z.number(),
    currency: z.string(),
    flights: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        date: z.string(),
        airline: z.string(),
        flightNumber: z.string(),
        departureTime: z.string(),
        fare: z.number(),
      }),
    ),
  }),

  execute: async ({ from, to, date }) => {
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    // Find all flights for this route, add the requested date, cheapest first.
    const flights = FLIGHTS.filter((x) => x.from === f && x.to === t)
      .map((x) => ({
        from: x.from,
        to: x.to,
        date,
        airline: x.airline,
        flightNumber: x.flightNumber,
        departureTime: x.departureTime,
        fare: x.fare,
      }))
      .sort((a, b) => a.fare - b.fare);

    return { count: flights.length, currency: "INR", flights };
  },
});
