#!/usr/bin/env node

const https = require('https');

const serverUrl = 'https://gohighlevel-mcp-production-23d2.up.railway.app/sse';

console.log('Testing N8n-style MCP connection to:', serverUrl);

// Step 1: Establish SSE connection and get session ID
function establishSSEConnection() {
  return new Promise((resolve, reject) => {
    console.log('\n1. Establishing SSE connection...');
    
    https.get(serverUrl, {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      let sessionId = null;
      
      res.on('data', (chunk) => {
        const data = chunk.toString();
        console.log('Received:', data);
        
        // Parse SSE data
        const lines = data.split('\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const content = line.substring(6);
            if (content.includes('sessionId=')) {
              sessionId = content.match(/sessionId=([^&\s]+)/)?.[1];
              console.log('Session ID:', sessionId);
            }
          }
        });
        
        if (sessionId) {
          res.destroy();
          resolve(sessionId);
        }
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        res.destroy();
        if (!sessionId) {
          reject(new Error('No session ID received'));
        }
      }, 5000);
    }).on('error', reject);
  });
}

// Step 2: Send initialize request
function sendInitializeRequest(sessionId) {
  return new Promise((resolve, reject) => {
    console.log('\n2. Sending initialize request with session ID:', sessionId);
    
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'n8n-test',
          version: '1.0.0'
        }
      },
      id: 1
    });
    
    const url = new URL(serverUrl);
    if (sessionId) {
      url.searchParams.set('sessionId', sessionId);
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'text/event-stream'
      }
    };
    
    const req = https.request(url.toString(), options, (res) => {
      console.log('Response status:', res.statusCode);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk.toString();
        console.log('Chunk received:', chunk.toString());
      });
      
      res.on('end', () => {
        console.log('Full response:', responseData);
        resolve(responseData);
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Step 3: Test tools/list
function testToolsList(sessionId) {
  return new Promise((resolve, reject) => {
    console.log('\n3. Testing tools/list...');
    
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/list',
      params: {},
      id: 2
    });
    
    const url = new URL(serverUrl);
    if (sessionId) {
      url.searchParams.set('sessionId', sessionId);
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url.toString(), options, (res) => {
      console.log('Response status:', res.statusCode);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });
      
      res.on('end', () => {
        try {
          // Try to parse as JSON
          const json = JSON.parse(responseData);
          console.log('Tools count:', json.result?.tools?.length || 0);
          console.log('First few tools:', json.result?.tools?.slice(0, 3));
        } catch (e) {
          console.log('Raw response:', responseData);
        }
        resolve(responseData);
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  try {
    const sessionId = await establishSSEConnection();
    await sendInitializeRequest(sessionId);
    await testToolsList(sessionId);
    
    console.log('\n✅ Connection test completed!');
    console.log('\nFor N8n configuration:');
    console.log('- Endpoint:', serverUrl);
    console.log('- Transport: SSE');
    console.log('- Session handling may be required');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();