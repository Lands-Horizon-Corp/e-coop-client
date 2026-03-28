# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Build the project (This generates .output/ based on your vite.config.ts)
RUN bun --bun vite build

# ==========================================
# Stage 2: Runtime (Bun + Nginx)
# ==========================================
FROM node:22.18.0-alpine

# Install Bun and Nginx
RUN npm install -g bun && apk add --no-cache nginx

WORKDIR /app

# Set the port for Nitro/Bun to match your Nginx proxy_pass (3000)
ENV PORT=3000

# 1. Copy the Nitro server output
COPY --from=builder /app/.output ./.output

# 2. Copy the static files for Nginx to serve directly
COPY --from=builder /app/.output/public /usr/share/nginx/html

# 3. Copy dependencies and package info
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 4. FIX: Overwrite the MAIN nginx.conf
# Your config has 'worker_processes' and 'http' blocks, so it MUST 
# replace the root config, not be placed in http.d/
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose Nginx's external port
EXPOSE 80

# The CMD:
# 1. Starts 'bun run start' (Nitro) in the background
# 2. Starts Nginx in the foreground
CMD ["sh", "-c", "bun run start & nginx -g 'daemon off;'"]