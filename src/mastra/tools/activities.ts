import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Maps friendly categories to OpenTripMap's "kinds" filter values.
const CATEGORY_KINDS: Record<string, string> = {
  cultural: "cultural",
  historic: "historic",
  nature: "natural",
  beaches: "beaches",
  amusement: "amusements",
  religion: "religion",
  food: "foods",
  any: "interesting_places",
};

export const searchActivities = createTool({
  id: "search-activities",

  description:
    "Find tourist attractions and things to do in a city (museums, forts, beaches, " +
    "temples, parks, etc.). Call this when the user asks what to see or do in a " +
    "destination. Optionally filter by a category.",

  inputSchema: z.object({
    city: z.string().describe("City name, e.g. Jaipur, Goa, Udaipur"),
    category: z
      .enum([
        "cultural",
        "historic",
        "nature",
        "beaches",
        "amusement",
        "religion",
        "food",
        "any",
      ])
      .optional()
      .describe("Optional category of attraction. Defaults to 'any'."),
  }),

  outputSchema: z.object({
    city: z.string(),
    activities: z.array(
      z.object({
        name: z.string(),
        kind: z.string(),
      }),
    ),
  }),

  execute: async ({ city, category }) => {
    const apiKey = process.env.OPENTRIPMAP_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENTRIPMAP_API_KEY is not set. Add it to your .env file.",
      );
    }

    const kinds = CATEGORY_KINDS[category ?? "any"];

    // STEP 1: Turn the city name into geographic coordinates (geocoding).
    const geoUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
      city,
    )}&apikey=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`Geocoding request failed (HTTP ${geoRes.status}).`);
    }
    const geo = await geoRes.json();
    if (!geo?.lat || !geo?.lon) {
      throw new Error(`Could not locate a city called "${city}".`);
    }

    // STEP 2: Use those coordinates to find attractions within 15km.
    const placesUrl =
      `https://api.opentripmap.com/0.1/en/places/radius` +
      `?radius=15000&lon=${geo.lon}&lat=${geo.lat}&kinds=${kinds}` +
      `&rate=2&format=json&limit=10&apikey=${apiKey}`;
    const placesRes = await fetch(placesUrl);
    if (!placesRes.ok) {
      throw new Error(`Places request failed (HTTP ${placesRes.status}).`);
    }
    const places = await placesRes.json();

    // Keep only places that actually have a name, and tidy up the shape.
    const activities = (Array.isArray(places) ? places : [])
      .filter((p: any) => p?.name && p.name.trim() !== "")
      .map((p: any) => ({
        name: p.name as string,
        // `kinds` is a comma-separated string; take the first as a simple label.
        kind: String(p.kinds ?? "").split(",")[0] || "attraction",
      }));

    return { city: geo.name ?? city, activities };
  },
});
