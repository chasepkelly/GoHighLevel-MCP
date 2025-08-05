FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist/ ./dist/
COPY .env.example ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ghl-mcp -u 1001 -G nodejs

USER ghl-mcp

EXPOSE 8000

# Default to HTTP server for cloud deployment
# For Claude Desktop STDIO, override: docker run ... yourusername/ghl-mcp-server node dist/server.js
CMD ["node", "dist/http-server.js"] 