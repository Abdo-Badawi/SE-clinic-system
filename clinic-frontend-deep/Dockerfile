# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer-cache friendly)
COPY package.json package-lock.json ./

# Install all deps (including devDeps needed for build)
RUN npm ci

# Copy source
COPY . .

# VITE_API_URL is baked in at build time.
# Pass it via --build-arg, e.g.:
#   docker build --build-arg VITE_API_URL=http://api.example.com:8080 .
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build          # outputs to /app/dist

# ── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
