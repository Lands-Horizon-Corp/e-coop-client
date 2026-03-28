# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Build the project
RUN bun --bun vite build

# ==========================================
# Stage 2: Runtime (Bun only)
# ==========================================
FROM node:22.18.0-alpine

# Install Bun
RUN npm install -g bun

WORKDIR /app

# Set the port the application will listen on
ENV PORT=3000
ENV NODE_ENV=production

# Copy the Nitro server output
COPY --from=builder /app/.output ./.output

# Expose the application port
EXPOSE 3000

# Start the Nitro server using Bun
CMD ["bun", ".output/server/index.mjs"]