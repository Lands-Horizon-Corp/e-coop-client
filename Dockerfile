# ==========================================
# Stage 1: Build the Application
# ==========================================
# Use the exact Node version you requested
FROM node:22.18.0-alpine AS builder

# Install the latest version of Bun globally
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json bun.lockb* ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build the Vite/React project (Outputs to the /dist folder)
RUN bun run build

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
# Use the lightweight Alpine version of Nginx
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom SPA Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled /dist folder from the builder stage to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Railway will automatically detect this and route traffic here)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]