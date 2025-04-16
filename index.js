#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const args = process.argv.slice(2);
const HOST_URL = process.env.HOST_URL || args[0];
const TOKEN = process.env.MCP_AUTH;

if (!HOST_URL) {
  throw new Error("HOST_URL environment variable is not set");
}
if (!TOKEN) {
  throw new Error("MCP_AUTH environment variable is not set");
}

const server = new Server(
  {
    name: "example-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  },
);

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const response = await fetch(`${HOST_URL}/schema`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: TOKEN,
    },
  });
  return response.json();
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const response = await fetch(`${HOST_URL}/execute/prompts`, {
    body: JSON.stringify(request),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: TOKEN,
    },
  });
  return response.json();
});

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  const response = await fetch(`${HOST_URL}/schema`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: TOKEN,
    },
  });
  return response.json();
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const response = await fetch(`${HOST_URL}/execute/tools`, {
    body: JSON.stringify(request),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: TOKEN,
    },
  });
  return response.json();
});

const serverTransport = new StdioServerTransport();
await server.connect(serverTransport);
