import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { TRAINS } from "../data/trains";

export const searchTrains = createTool({
  id: "search-trains",

  description:
    "Get train options and fares (in ₹) between two Indian cities. Call this when " +
    "the user asks about trains or rail travel. Use CITY names (e.g. Delhi, Jaipur, " +
    "Goa, Mumbai) — NOT airport codes.",

  inputSchema: z.object({
    from: z.string().describe("Departure city name, e.g. Delhi"),
    to: z.string().describe("Destination city name, e.g. Jaipur"),
    date: z.string().describe("Travel date as YYYY-MM-DD, e.g. 2026-12-20"),
  }),

  outputSchema: z.object({
    count: z.number(),
    currency: z.string(),
    trains: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        date: z.string(),
        trainNumber: z.string(),
        trainName: z.string(),
        departureTime: z.string(),
        arrivalTime: z.string(),
        duration: z.string(),
        fare: z.number(),
      }),
    ),
  }),

  execute: async ({ from, to, date }) => {
    // Match city names case-insensitively so "delhi" and "Delhi" both work.
    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();

    const trains = TRAINS.filter(
      (x) => x.from.toLowerCase() === f && x.to.toLowerCase() === t,
    )
      .map((x) => ({
        from: x.from,
        to: x.to,
        date,
        trainNumber: x.trainNumber,
        trainName: x.trainName,
        departureTime: x.departureTime,
        arrivalTime: x.arrivalTime,
        duration: x.duration,
        fare: x.fare,
      }))
      .sort((a, b) => a.departureTime.localeCompare(b.departureTime));

    return { count: trains.length, currency: "INR", trains };
  },
});
