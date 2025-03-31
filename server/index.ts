import express, { type Request, type Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

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
  console.log("prompts/list");
  return {
    prompts: [
      {
        name: "example-prompt",
        description: "An example prompt template",
        arguments: [
          {
            name: "arg1",
            description: "Example argument",
            required: true,
          },
        ],
      },
      {
        name: "fetch-openapi-custom",
        description: "fetch openapi custom",
        arguments: [
          {
            name: "appName",
            description: "application name",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("prompts/tools");
  return {
    tools: [
      {
        name: "fetchOpenApi-tool-example",
        description: "Fetch OpenAPI tools",
        inputSchema: {
          type: "object",
          properties: {
            appName: {
              type: "string",
              description: "appName to get openapi",
            },
          },
          required: ["appName"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.log("prompts/execute", request);
  return {
    content: [
      {
        type: "text",
        text: "Example prompt tool example",
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  console.log("prompts/execute");
  return {
    description: "Example prompt",
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Example prompt text",
        },
      },
    ],
  };
});

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: { [sessionId: string]: SSEServerTransport } = {};

app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
});

app.listen(3001);
