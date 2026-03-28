# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22-bookworm-slim AS builder

# Install Bun
RUN npm install -g bun
WORKDIR /app

# Copy dependencies first for caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the code (Make sure .dockerignore is set!)
COPY . .

# Build the project
RUN bun run build

# ==========================================
# Stage 2: Runtime (Bun + Nginx)
# ==========================================
FROM node:22-bookworm-slim

# Install Bun and Nginx on Debian
RUN npm install -g bun && \
    apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built files and dependencies needed for 'bun run start'
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Setup Nginx configuration
RUN mkdir -p /run/nginx
# FIX: Because your config includes the `http {}` block, 
# it MUST replace the master nginx.conf, not sit in conf.d/
COPY nginx.conf /etc/nginx/nginx.conf

# Expose Nginx's external port
EXPOSE 80

# Starts 'bun run start' and Nginx
CMD ["sh", "-c", "bun run start & nginx -g 'daemon off;'"]