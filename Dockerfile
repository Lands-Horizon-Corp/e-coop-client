# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Build the project (This generates .output/public based on your vite.config.ts)
RUN bun --bun vite build

# ==========================================
# Stage 2: Runtime (Bun + Nginx)
# ==========================================
FROM node:22.18.0-alpine

# Install Bun and Nginx
RUN npm install -g bun && apk add --no-cache nginx

WORKDIR /app

# 1. Copy the entire Nitro output (Contains the server and the public files)
COPY --from=builder /app/.output ./.output

# 2. FIX: Copy from .output/public instead of /app/dist
COPY --from=builder /app/.output/public /usr/share/nginx/html

# 3. Copy other necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Setup Nginx configuration
RUN mkdir -p /run/nginx
# Note: Ensure nginx.conf is in the same directory as your Dockerfile
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose Nginx's external port
EXPOSE 80

# Start 'bun run start' (Nitro server) and Nginx
CMD ["sh", "-c", "bun run start & nginx -g 'daemon off;'"]