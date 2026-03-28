# ==========================================
# Stage 1: Build
# ==========================================
FROM oven/bun:1.1-slim AS builder

WORKDIR /app

# 1. Copy lockfiles first to leverage Docker caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# 2. Copy the rest of the source
COPY . .

# 3. Run the build (Creates the .output folder)
RUN bun run build

# ==========================================
# Stage 2: Runtime
# ==========================================
FROM oven/bun:1.1-slim

# Install Nginx
RUN apt-get update && apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 4. Copy the Server build (for Bun)
COPY --from=builder /app/.output ./.output

# 5. Copy the Static build (for Nginx)
# Nitro usually places static assets in .output/public
COPY --from=builder /app/.output/public /usr/share/nginx/html

# 6. Copy package info
COPY --from=builder /app/package.json ./package.json

# 7. Nginx Setup
RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/nginx.conf

# 8. Set permissions so Nginx can read the files
RUN chown -R www-data:www-data /usr/share/nginx/html

EXPOSE 80

# Start Bun in the background and Nginx in the foreground
CMD ["sh", "-c", "bun run start & nginx -g 'daemon off;'"]