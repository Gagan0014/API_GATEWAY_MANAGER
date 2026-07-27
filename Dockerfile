FROM node:16-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm install --omit=dev

COPY backend .

FROM node:16-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "start"]
