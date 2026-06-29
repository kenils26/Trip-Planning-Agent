import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// A TOOL is a typed function the agent (Claude) can choose to call.
// The LLM reads the `description` + `inputSchema` to decide *when* and *how*
// to call it. Your `execute` function does the real work and returns data.
export const convertCurrency = createTool({
  // 1. id — unique name for this tool.
  id: "convert-currency",

  // 2. description — the most important part for the LLM. Be prescriptive about
  //    WHEN to call it, not just what it does.
  description:
    "Convert an amount of money from one currency to another using live exchange " +
    "rates. Call this whenever the user mentions a price in a foreign currency and " +
    "would benefit from seeing it in Indian Rupees (INR), or asks to convert between " +
    "any two currencies.",

  // 3. inputSchema — a Zod schema. This both validates the input AND tells Claude
  //    exactly what arguments to provide. The `.describe()` text guides the LLM.
  inputSchema: z.object({
    amount: z
      .number()
      .positive()
      .describe("The amount of money to convert, e.g. 100"),
    from: z
      .string()
      .length(3)
      .describe("3-letter ISO currency code to convert FROM, e.g. USD, EUR, GBP"),
    to: z
      .string()
      .length(3)
      .describe("3-letter ISO currency code to convert TO, e.g. INR"),
  }),

  // outputSchema — describes the shape of what we return (good practice; helps
  //    the LLM understand the result it gets back).
  outputSchema: z.object({
    amount: z.number(),
    from: z.string(),
    to: z.string(),
    converted: z.number(),
    rate: z.number(),
    date: z.string(),
  }),

  // 4. execute — the actual work. The first argument is the validated input
  //    (already matching inputSchema). We call the free Frankfurter API.
  execute: async ({ amount, from, to }) => {
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    // Frankfurter is a free, no-key currency API backed by European Central Bank data.
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${f}&to=${t}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Currency API request failed (HTTP ${res.status}).`);
    }

    const data = await res.json();
    const converted = data?.rates?.[t];

    if (typeof converted !== "number") {
      throw new Error(
        `Could not convert ${f} to ${t}. One of the currency codes may be invalid.`,
      );
    }

    return {
      amount,
      from: f,
      to: t,
      converted,
      rate: converted / amount, // price of 1 unit of `from` in `to`
      date: data.date, // the date these exchange rates are from
    };
  },
});
