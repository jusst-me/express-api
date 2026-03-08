# Stage 1: Development (hot reload with tsx watch)
FROM node:24-alpine AS development
WORKDIR /app
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .husky/install.mjs .husky/install.mjs
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY . .
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "dev"]

# Stage 2: Build
FROM node:24-alpine AS builder
WORKDIR /app
ENV CI=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .husky/install.mjs .husky/install.mjs
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 3: Run
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --prod --frozen-lockfile --ignore-scripts
CMD ["node", "dist/index.js"]
