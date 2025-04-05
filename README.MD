# MCP Server Proxy

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
          "--init",
          "-e",
          "HOST_URL=http://host.docker.internal:3001/sse",
          "-e",
          "MCP_AUTH=secret",
          "-i",
          "ghcr.io/granbestiapop/mcp-proxy:0.0.2"
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
        "args": [
          "-y",
          "github:granbestiapop/mcp-proxy"
        ],
        "env": {
          "HOST_URL": "https://my-server.dev/sse",
          "MCP_AUTH": "secret"
        }
      },
      "settings": {}
    }
```

## IDE Extensions
### Continue.dev / Docker
```
mcpServers:
  - name: testmcp
    command: docker
    args:
      - 'run'
      - '--rm'
      - '--init'
      - '-i'
      - '-e'
      - 'HOST_URL=https://your-mcp-server/sse'
      - '-e'
      - 'MCP_AUTH=secret'
      - 'ghcr.io/granbestiapop/mcp-proxy'
```

### Zed / Docker
```
  "context_servers": {
    "mcp-proxy-docker": {
      "command": {
        "path": "docker",
        "args": [
          "run",
          "--rm",
          "--init",
          "-i",
          "-e",
          "HOST_URL=https://your-mcp-server/sse",
          "-e",
          "MCP_AUTH=secret",
          "ghcr.io/granbestiapop/mcp-proxy"
        ]
      },
      "settings": {}
    }
  }
```
