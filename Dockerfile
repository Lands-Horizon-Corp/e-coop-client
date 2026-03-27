# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM node:22.18.0-alpine AS builder

RUN npm install -g bun

WORKDIR /app

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

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]