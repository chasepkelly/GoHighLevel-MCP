# N8n MCP Client Configuration for GoHighLevel Railway Instance

## Connection Settings

### For N8n MCP Client Node:

```json
{
  "serverUrl": "https://your-app-name.railway.app/sse",
  "transport": "sse",
  "headers": {
    "Accept": "text/event-stream"
  }
}
```

## Troubleshooting Steps

### 1. Test Your Railway Instance

Run the test script to verify your Railway deployment is accessible:

```bash
node test-railway-connection.js https://your-app-name.railway.app
```

### 2. Check Railway Environment Variables

Ensure these are set in your Railway project:
- `GHL_API_KEY` - Your GoHighLevel API key
- `GHL_LOCATION_ID` - Your GoHighLevel location ID  
- `GHL_BASE_URL` - Should be `https://services.leadconnectorhq.com`
- `PORT` - Railway will set this automatically

### 3. Common Issues and Solutions

#### Connection Refused
- Verify your Railway app is deployed and running
- Check Railway logs: `railway logs`
- Ensure the app hasn't crashed due to missing env vars

#### 404 Not Found
- Confirm you're using the `/sse` endpoint
- The full URL should be: `https://your-app-name.railway.app/sse`

#### CORS Issues
- The server includes CORS headers for all origins
- If still having issues, check if N8n is sending preflight requests

#### Timeout Issues
- The SSE connection is long-lived
- N8n should maintain the connection open
- Check N8n timeout settings

### 4. N8n Workflow Configuration

In your N8n workflow with the MCP Client node:

1. **Server URL**: Use your Railway URL with `/sse` endpoint
2. **Transport Type**: Select "SSE" (Server-Sent Events)
3. **Method**: Use `tools/list` to test connection
4. **Headers**: Add `Accept: text/event-stream`

### 5. Example N8n MCP Request

To list available tools:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
```

To call a tool (e.g., get contact):
```json
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

### 6. Verify Railway Deployment

Check deployment status:
```bash
railway status
railway logs --tail 50
```

### 7. Test with cURL

Test the SSE endpoint directly:
```bash
curl -N -H "Accept: text/event-stream" https://your-app-name.railway.app/sse
```

Test MCP handshake:
```bash
curl -X POST https://your-app-name.railway.app/sse \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    },
    "id": 1
  }'
```

## Need More Help?

1. Check Railway logs for any errors
2. Verify all environment variables are set correctly
3. Test the endpoint with the provided test script
4. Ensure N8n MCP Client node is configured for SSE transport