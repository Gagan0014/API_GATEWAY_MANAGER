# Multi-stage build for GenAI API Gateway

# Stage 1: Build
FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:16-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 5000

# Use dumb-init to run node
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
