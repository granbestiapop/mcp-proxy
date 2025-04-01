#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { URL } from "node:url";

const args = process.argv.slice(2);
const HOST_URL = process.env.HOST_URL || args[0];
const TOKEN = process.env.MCP_AUTH;

if (!HOST_URL) {
  throw new Error("HOST_URL environment variable is not set");
}
if (!TOKEN) {
  throw new Error("MCP_AUTH environment variable is not set");
}

const transport = new SSEClientTransport(new URL(HOST_URL), {
  requestInit: {
    headers: {
      Authorization: TOKEN,
    },
  },
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  },
);

await client.connect(transport);

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
  const prompts = await client.listPrompts();
  return prompts;
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const response = await client.getPrompt(request.params);
  return response;
});

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  const response = await client.listTools(request.params);
  return response;
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const response = await client.callTool(request.params);
  return response;
});

const serverTransport = new StdioServerTransport();
await server.connect(serverTransport);
