# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

# Install the latest version of Bun globally
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package.json bun.lock* ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# --- NEW: Environment Injection ---
# Vite looks for variables prefixed with VITE_ 
# This captures your Railway/system variables into the .env file
RUN printenv > .env.production

# Build the Vite project using the script in package.json
# (This usually runs "vite build" which outputs to /dist)
RUN bun run build

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom SPA Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled /dist folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]