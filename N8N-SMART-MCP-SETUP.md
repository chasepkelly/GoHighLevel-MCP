# N8n Smart MCP Setup Guide

This guide shows how to use the smart MCP endpoint that dynamically selects tools based on user intent, staying under OpenAI's 128 tool limit.

## Option 1: Direct MCP Client Configuration

### MCP Client Node Settings:
- **Endpoint**: `https://gohighlevel-mcp-production-23d2.up.railway.app/mcp-smart`
- **Transport**: `HTTP Streamable`
- **Authentication**: 
  - Type: `Header based Auth`
  - Key: `Authorization`
  - Value: `Bearer pit-dbcb9ffb-8556-4983-a9a7-674955babf13`

## Option 2: Using Code Node + HTTP Request (Recommended)

Since the standard MCP Client doesn't pass context, use this approach:

### 1. Add a Code Node before your HTTP Request:

```javascript
// Extract user message and conversation history
const userMessage = $input.first().json.message || "Default message";
const conversationHistory = $input.first().json.history || [];

// Prepare the tools/list request with context
const toolsListRequest = {
  jsonrpc: "2.0",
  method: "tools/list",
  params: {
    context: {
      userMessage: userMessage,
      previousMessages: conversationHistory.slice(-3) // Last 3 messages
    }
  },
  id: 1
};

return {
  json: {
    toolsRequest: toolsListRequest,
    userMessage: userMessage
  }
};
```

### 2. HTTP Request Node for Tools List:
- **Method**: `POST`
- **URL**: `https://gohighlevel-mcp-production-23d2.up.railway.app/mcp-smart`
- **Headers**:
  ```
  Authorization: Bearer pit-dbcb9ffb-8556-4983-a9a7-674955babf13
  Content-Type: application/json
  ```
- **Body**: `{{ $json.toolsRequest }}`

### 3. Process Tools Response:
Add another Code node:
```javascript
// Extract the dynamically selected tools
const toolsResponse = $input.first().json;
const selectedTools = toolsResponse.result.tools;
const detectedIntents = toolsResponse.result._meta.detectedIntents;

console.log(`Selected ${selectedTools.length} tools for intents: ${detectedIntents.join(', ')}`);

// Format for OpenAI
return {
  json: {
    tools: selectedTools,
    toolCount: selectedTools.length,
    intents: detectedIntents
  }
};
```

### 4. OpenAI Chat Model Node:
- Use the `{{ $json.tools }}` from the previous step
- This ensures you never exceed 128 tools

## Example N8n Workflow Structure:

```
[Trigger] → [Code: Prepare Context] → [HTTP: Get Smart Tools] → [Code: Process Tools] → [OpenAI Chat] → [HTTP: Call Tool]
```

## How It Works:

1. **Intent Detection**: The smart endpoint analyzes the user message and detects intent categories:
   - contact_management (contacts, leads, customers)
   - communication (messages, emails, conversations)
   - sales (opportunities, deals, pipelines)
   - calendar (appointments, scheduling)
   - marketing (campaigns, workflows)
   - commerce (products, payments, invoices)
   - And more...

2. **Dynamic Tool Selection**: Based on detected intents, it selects only relevant tools:
   - Maximum 120 tools (under OpenAI's 128 limit)
   - Prioritizes tools matching the user's intent
   - Always includes essential general tools

3. **Context Awareness**: Pass conversation history for better intent detection

## Example Intents and Selected Tools:

### User says: "I need to send an email to my contacts"
- **Detected intents**: `communication`, `contact_management`
- **Selected tools**: Email tools, contact search/get tools, message tools

### User says: "Show me today's appointments and opportunities"
- **Detected intents**: `calendar`, `sales`
- **Selected tools**: Calendar tools, appointment tools, opportunity tools

### User says: "Create a new product and update pricing"
- **Detected intents**: `commerce`
- **Selected tools**: Product tools, price tools, store tools

## Testing the Smart Endpoint:

```bash
curl -X POST https://gohighlevel-mcp-production-23d2.up.railway.app/mcp-smart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pit-dbcb9ffb-8556-4983-a9a7-674955babf13" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {
      "context": {
        "userMessage": "I need to create a contact and send them an email"
      }
    },
    "id": 1
  }'
```

## Benefits:

1. ✅ Never exceeds OpenAI's 128 tool limit
2. ✅ Provides relevant tools based on user intent
3. ✅ Reduces token usage by excluding irrelevant tools
4. ✅ Better performance with focused tool set
5. ✅ Maintains access to all 215 tools (dynamically selected)

## Fallback Option:

If intent detection doesn't work well for your use case, you can still use:
- `/mcp` endpoint with manually selected tools in N8n
- Create multiple workflows for different tool categories