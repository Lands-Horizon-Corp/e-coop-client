# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun

WORKDIR /app

# Note: Using bun.lockb* to support both Bun formats
COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

RUN printenv | grep '^VITE_' > .env || touch .env

# Build the Vite/React project (Outputs to the /dist folder)
RUN bun run build

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
FROM nginx:alpine

# Install sed (required for your entrypoint script to work)
RUN apk add --no-cache sed

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# --- THE MISSING PIECES THAT CAUSE YOUR ERROR ---
# 1. Copy the script from your local project into the image
COPY entrypoint.sh /entrypoint.sh
# 2. Make sure the script has permission to execute
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]