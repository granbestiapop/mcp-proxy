#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
  name: "mcp-proxy",
  version: "0.1.0",
  capabilities: {
    prompt: true,
  },
});
const HOST_URL = process.env.HOST_URL;
if (!HOST_URL) {
  throw new Error("HOST_URL environment variable is not set");
}

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  process.stderr.write("Handling prompts/list request\n");
  const req = await fetch(`${HOST_URL}/prompts`);
  if (!req.ok) {
    const body = await req.json();
    throw new Error(
      `HTTP error! status: ${req.status}, message: ${body.message}`,
    );
  }
  const prompts = await req.json();
  return prompts;
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  process.stderr.write("Handling prompts/get request\n");
  const req = await fetch(`${HOST_URL}/prompts/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!req.ok) {
    const body = await req.json();
    throw new Error(
      `HTTP error! status: ${req.status}, message: ${body.message}`,
    );
  }
  const response = await req.json();
  return response;
});

async function runServer() {
  console.log("start server");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
