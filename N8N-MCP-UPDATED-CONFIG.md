# N8n MCP Client Configuration - Updated

Your GoHighLevel MCP server on Railway now supports **HTTP Streamable** transport for N8n!

## Updated Configuration for N8n MCP Client Node

### 1. **Endpoint**
```
https://gohighlevel-mcp-production-23d2.up.railway.app/mcp
```

### 2. **Server Transport**
```
HTTP Streamable
```

### 3. **Authentication and Options**
- **Authentication Type**: `Header based Auth`
- **Key**: `Authorization`
- **Value**: `Bearer pit-dbcb9ffb-8556-4983-a9a7-674955babf13`

### 4. **Tools to Include**
Leave empty to include all 215 tools, or specify specific ones like:
- `get_contact`
- `create_contact`
- `update_contact`
- `search_contacts`
- etc.

## What's New

1. **HTTP Streamable Support**: Your Railway instance now supports the same transport protocol as the official GoHighLevel MCP server
2. **Authentication**: Bearer token authentication is now required (matching the official server)
3. **Same Endpoint Structure**: Uses `/mcp` endpoint just like the official server
4. **All 215 Tools**: You still have access to all your custom tools, not just the limited set from the official server

## Testing the New Endpoint

Test with cURL:
```bash
curl -X POST https://gohighlevel-mcp-production-23d2.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-dbcb9ffb-8556-4983-a9a7-674955babf13" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "n8n-test",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

## Deployment Instructions

To deploy these changes to Railway:

1. **Commit and push the changes**:
   ```bash
   git add .
   git commit -m "Add HTTP Streamable support for N8n MCP Client"
   git push
   ```

2. **Railway will automatically rebuild and deploy**

3. **Once deployed, your N8n workflow should work with the configuration above**

## Troubleshooting

If you still have issues:

1. **Check Railway logs**: 
   ```bash
   railway logs --tail 100
   ```

2. **Verify the endpoint**: Visit https://gohighlevel-mcp-production-23d2.up.railway.app/ in your browser - you should see the server info showing the new `/mcp` endpoint

3. **Test authentication**: Make sure you're using "Bearer " (with space) before your API key

4. **N8n version**: Ensure you have N8n v1.104 or later for HTTP Streamable support

## Benefits Over Official Server

Your custom server provides:
- ✅ All 215 tools (vs limited set in official)
- ✅ Same HTTP Streamable protocol for N8n compatibility
- ✅ Bearer token authentication
- ✅ Your own Railway deployment under your control
- ✅ Can be customized further as needed