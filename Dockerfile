# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY .env.example ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ghl-mcp -u 1001 -G nodejs

USER ghl-mcp

EXPOSE 8000

# Default to HTTP server for cloud deployment
CMD ["node", "dist/http-server.js"]