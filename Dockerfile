# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Build the Vite/React project
RUN bun run build

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
FROM nginx:alpine

# Install sed (usually in alpine by default)
RUN apk add --no-cache sed

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# --- THE FIX ---
# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
# Grant execution permissions
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]