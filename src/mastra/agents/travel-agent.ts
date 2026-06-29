import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { convertCurrency } from "../tools/currency";
import { getWeather } from "../tools/weather";
import { searchActivities } from "../tools/activities";

// Memory gives the agent the ability to remember. It is backed by LibSQL — a
// local SQLite file that persists to disk, so memories survive restarts.
//
// The `file:../mastra.db` path is relative to Mastra's build output folder
// (.mastra/output), which resolves to a single `mastra.db` in your project root.
const memory = new Memory({
  storage: new LibSQLStore({ id: "travel-storage", url: "file:../mastra.db" }),
  options: {
    // Include the last 20 messages of the conversation so the agent has context
    // for the current chat (this is what fixes "it forgot what I just said").
    lastMessages: 20,

    // Working memory = a small structured profile the agent maintains and updates
    // as it learns about you. It persists across conversations, so the agent can
    // recall your budget or preferences in a brand-new chat days later.
    workingMemory: {
      enabled: true,
      template: `# Traveller Profile
- Name:
- Home city:
- Destination:
- Travel dates:
- Number of travellers:
- Budget (₹):
- Trip style (relaxed / adventure / family / honeymoon / ...):
- Preferences & notes:
`,
    },
  },
});

// This is our agent: an LLM (Claude) + a set of instructions that shape how it behaves.
// In Phase 0 it has NO tools yet — it can only chat. We add tools and memory later.
export const travelAgent = new Agent({
  // `id` is a stable, code-facing identifier (used in URLs, storage, logs).
  // `name` is the human-friendly display label shown in the playground.
  id: "travel-agent",
  name: "Travel Agent",

  // `instructions` is the system prompt: the agent's personality, job, and rules.
  instructions: `
You are "Yatri", a friendly and knowledgeable India-focused travel assistant.

Your job is to help users plan trips within India through natural conversation.

How to behave:
- Be warm, concise, and helpful. Use Indian rupees (₹) for any prices.
- When a user wants to plan a trip, gently gather the details you need before
  giving recommendations: destination, travel dates, number of travellers,
  approximate budget (in ₹), and the kind of trip they want (relaxed, adventure,
  family, etc.).
- Ask for missing details one or two at a time — never interrogate the user with
  a long list of questions.
- You can convert currencies using your convert-currency tool. When a user
  mentions a price in a foreign currency (USD, EUR, etc.), proactively convert it
  to Indian Rupees (₹) so it's easy to understand.
- You can check current weather for a city using your get-weather tool. Use it
  when the user asks about current conditions or what to pack. For seasonal "best
  time to visit" questions, rely on your own knowledge — the tool only gives
  current weather, not forecasts.
- You can find attractions and things to do in a city using your search-activities
  tool. Use it when the user asks what to see or do at a destination.
- You do NOT yet have access to live flight, train, or hotel data. If a user asks
  for specific prices or availability of those, be honest that you can't look that
  up yet, and offer general guidance instead.

Keep replies short and conversational unless the user asks for detail.
`,

  // The model that powers the agent. `anthropic(...)` reads your ANTHROPIC_API_KEY
  // from the environment automatically. claude-sonnet-4-6 is fast and cheap —
  // ideal while we iterate. Switch the string to "claude-opus-4-8" anytime to upgrade.
  model: anthropic("claude-sonnet-4-6"),

  // Attach the memory we configured above. THIS is what actually turns on
  // remembering — without this line, the agent ignores stored history.
  memory,

  // Tools the agent can choose to call. The LLM decides when to use each one
  // based on its description. Add more tools to this object as we build them.
  tools: { convertCurrency, getWeather, searchActivities },
});
