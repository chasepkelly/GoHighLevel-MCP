# N8n MCP Connection Troubleshooting

## The Issue
The "Could not connect to your MCP server" error in N8n is likely due to one of these reasons:

## 1. N8n MCP Client Transport Compatibility

The GoHighLevel MCP server uses the standard MCP SSE transport, but N8n's MCP Client node might have specific requirements.

### Try These Configurations:

#### Option A: SSE Transport
```
Endpoint: https://gohighlevel-mcp-production-23d2.up.railway.app/sse
Server Transport: SSE
```

#### Option B: HTTP Transport (if available)
```
Endpoint: https://gohighlevel-mcp-production-23d2.up.railway.app
Server Transport: HTTP
```

## 2. Alternative: Use HTTP Request Node

If the MCP Client node doesn't work, you can interact with the server using N8n's HTTP Request node:

### List Available Tools:
```
Method: POST
URL: https://gohighlevel-mcp-production-23d2.up.railway.app/sse
Headers: 
  Content-Type: application/json
Body:
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
```

### Call a Tool (Example: Get Contact):
```
Method: POST
URL: https://gohighlevel-mcp-production-23d2.up.railway.app/sse
Headers:
  Content-Type: application/json
Body:
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "get_contact",
    "arguments": {
      "contact_id": "your-contact-id"
    }
  },
  "id": 2
}
```

## 3. Create a Custom N8n Node

If you need full MCP protocol support, you might need to create a custom N8n node that properly handles the SSE transport with session management.

## 4. Use the HTTP API Directly

Your server exposes these endpoints that can be used with standard HTTP Request nodes:

- `GET /` - Server info
- `GET /health` - Health check
- `GET /tools` - List all tools (simpler than MCP protocol)
- `POST /sse` - MCP protocol endpoint

## 5. Debug Steps

1. **Check N8n Version**: Ensure you have the latest N8n version with MCP support
2. **Check Logs**: Look at your Railway logs when N8n tries to connect:
   ```
   railway logs --tail 100
   ```
3. **Network Issues**: Ensure N8n can reach your Railway URL (no firewall/proxy issues)

## 6. Workaround: Direct Tool Endpoints

Consider adding direct REST endpoints to your GoHighLevel server for easier N8n integration:

```typescript
// Add to http-server.ts
app.post('/api/contacts/get', async (req, res) => {
  const { contact_id } = req.body;
  const result = await contactTools.getContact({ contact_id });
  res.json(result);
});
```

## 7. Contact N8n Community

The MCP Client node in N8n might have specific requirements or bugs. Consider:
- Checking N8n community forums
- Opening an issue if it's a compatibility problem
- Using alternative nodes (HTTP Request) as a workaround