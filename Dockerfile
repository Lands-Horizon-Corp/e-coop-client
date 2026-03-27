# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

# Install the latest version of Bun globally
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json bun.lock* ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# --- NEW: Create the .env.production file from Environment Variables ---
# This takes all available build-time environment variables and 
# writes them into the file Bun is looking for.
RUN printenv > .env.production

# Build using your specific Bun command
RUN bun build --env-file=.env.production ./index.ts --outdir ./dist

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom SPA Nginx configuration (make sure nginx.conf is in your root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled /dist folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]