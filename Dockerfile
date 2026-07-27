# Multi-stage build for GenAI API Gateway

# Stage 1: Install dependencies
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Use npm install because package-lock.json is missing
RUN npm install --omit=dev

# Stage 2: Runtime
FROM node:16-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "start"]
