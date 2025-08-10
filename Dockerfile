# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for future use

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

# Install workspace deps first for better caching
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY backend/package.json backend/package-lock.json ./backend/
COPY shared/package.json shared/package-lock.json ./shared/
RUN npm ci

# Copy sources
COPY . .

# Build shared and frontend assets
RUN npm run build:shared && npm run build:frontend

# Optional backend build stage (artifacts under /app/backend/lib)
FROM builder AS backend-builder
RUN npm run build:backend

# Final image serving the frontend with Nginx
FROM nginx:alpine AS frontend
COPY --from=builder /app/frontend/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


