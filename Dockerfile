# Stage 1: Development (hot reload with tsx watch)
FROM node:24-alpine AS development
WORKDIR /app
ENV CI=true
COPY package.json pnpm-lock.yaml ./
COPY .husky/install.mjs .husky/install.mjs
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# Stage 2: Build
FROM node:24-alpine AS builder
WORKDIR /app
# Husky docs: use CI or HUSKY=0 to skip hook install in Docker
# https://typicode.github.io/husky/how-to.html#ci-server-and-docker
ENV CI=true
COPY package.json pnpm-lock.yaml ./
# Only install.mjs needed for prepare script (exits early when CI=true)
COPY .husky/install.mjs .husky/install.mjs
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 3: Run
FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --prod --frozen-lockfile --ignore-scripts
CMD ["node", "dist/index.js"]
