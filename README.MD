# MCP Server Proxy

## Zed Configuration
* Zed only supports STDIO MCP server, we have two alternatives.

### Docker
Update your sse endpoint
```
  "context_servers": {
    "mcp-proxy-docker": {
      "command": {
        "path": "docker",
        "args": [
          "run",
          "--rm",
          "-e",
          "HOST_URL=http://host.docker.internal:3001/sse",
          "-i",
          "mcp-server-proxy"
        ]
      },
      "settings": {}
    },
    ...
```

## npx

```
    "mcp-proxy-npx": {
      "command": {
        "path": "npx",
        "args": ["github:granbestiapop/mcp-proxy"],
        "env": {
          "HOST_URL": "https://my-server.dev/sse"
        }
      },
      "settings": {}
    }
```
