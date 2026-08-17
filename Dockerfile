# Multi-stage production build for Soberano Contábil
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# 1. Dependencies Stage
FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/core/package.json ./packages/core/
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 2. Builder Stage
FROM deps AS builder
COPY . .
RUN pnpm --filter @soberano/core build || true
RUN pnpm --filter @soberano/web build

# 3. Production Fastify Backend Server
FROM node:20-alpine AS server
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/server ./packages/server
COPY --from=builder /app/packages/core ./packages/core
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "packages/server/src/index.ts"]

# 4. Production Web Frontend (Nginx)
FROM nginx:alpine AS web
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
