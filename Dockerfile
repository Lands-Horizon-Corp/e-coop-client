# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Environment Injection
RUN printenv | grep VITE_ > .env.production

# Build the project (This generates your .output/ and /dist)
RUN bun run build

# ==========================================
# Stage 2: Runtime (Bun + Nginx)
# ==========================================
FROM node:22.18.0-alpine

# Install Bun and Nginx
RUN npm install -g bun && apk add --no-cache nginx

WORKDIR /app

# Copy built files and dependencies needed for 'bun run start'
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Setup Nginx configuration
# In Alpine, the default config path is usually /etc/nginx/http.d/
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose Nginx's external port
EXPOSE 80

# The "Magic" Command:
# 1. Starts 'bun run start' (defaulting to port 3000) in the background (&)
# 2. Starts Nginx in the foreground to keep the container alive
CMD ["sh", "-c", "bun run start & nginx -g 'daemon off;'"]