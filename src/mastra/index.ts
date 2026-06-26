import { Mastra } from "@mastra/core";
import { travelAgent } from "./agents/travel-agent";

// This is the central Mastra instance. Everything we build — agents, tools,
// memory, workflows — gets registered here. The `mastra dev` playground reads
// this file to know what to show you.
export const mastra = new Mastra({
  agents: { travelAgent },
});
