#!/usr/bin/env node

/**
 * Test script to verify Railway MCP server connectivity
 * Usage: node test-railway-connection.js <your-railway-url>
 */

const https = require('https');
const http = require('http');

const railwayUrl = process.argv[2];

if (!railwayUrl) {
  console.error('Usage: node test-railway-connection.js <your-railway-url>');
  console.error('Example: node test-railway-connection.js https://your-app.railway.app');
  process.exit(1);
}

console.log(`Testing connection to: ${railwayUrl}`);

// Test 1: Check root endpoint
async function testRootEndpoint() {
  return new Promise((resolve) => {
    const url = new URL(railwayUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    protocol.get(railwayUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n✅ Root endpoint test:');
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error('\n❌ Root endpoint test failed:', err.message);
      resolve();
    });
  });
}

// Test 2: Check SSE endpoint
async function testSSEEndpoint() {
  return new Promise((resolve) => {
    const sseUrl = `${railwayUrl}/sse`;
    const url = new URL(sseUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const options = {
      headers: {
        'Accept': 'text/event-stream'
      }
    };
    
    protocol.get(sseUrl, options, (res) => {
      console.log('\n✅ SSE endpoint test:');
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      // Listen for a few seconds then close
      setTimeout(() => {
        res.destroy();
        resolve();
      }, 2000);
      
      res.on('data', (chunk) => {
        console.log(`SSE Data: ${chunk}`);
      });
    }).on('error', (err) => {
      console.error('\n❌ SSE endpoint test failed:', err.message);
      resolve();
    });
  });
}

// Test 3: Test MCP protocol handshake
async function testMCPHandshake() {
  return new Promise((resolve) => {
    const sseUrl = `${railwayUrl}/sse`;
    const url = new URL(sseUrl);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      },
      id: 1
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = protocol.request(sseUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n✅ MCP handshake test:');
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.error('\n❌ MCP handshake test failed:', err.message);
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('Starting Railway MCP server tests...\n');
  
  await testRootEndpoint();
  await testSSEEndpoint();
  await testMCPHandshake();
  
  console.log('\n✅ Tests completed!');
  console.log('\nFor N8n MCP client configuration:');
  console.log(`- Server URL: ${railwayUrl}/sse`);
  console.log('- Transport: sse');
  console.log('- Headers: Accept=text/event-stream');
}

runTests();