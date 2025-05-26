# Multi-stage build for React Native Expo Web App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variables
ARG EXPO_PUBLIC_YOUTUBE_API_KEY
ENV EXPO_PUBLIC_YOUTUBE_API_KEY=${EXPO_PUBLIC_YOUTUBE_API_KEY}

# Build the web version of the app
RUN npm run build:web

# Production stage
FROM nginx:alpine AS production

# Copy built files to nginx (Expo exports to 'dist' directory)
COPY --from=builder /app/dist /usr/share/nginx/html
