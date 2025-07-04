# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment-specific builds
ARG REACT_APP_API_URL=http://localhost:8000/api/v1
ARG REACT_APP_BACKEND_URL=http://localhost:8000
ARG REACT_APP_AI_CHAT_URL=http://localhost:8501
ARG REACT_APP_DOCUMENT_ANALYSIS_URL=http://localhost:8502
ARG REACT_APP_WEB_SEARCH_URL=http://localhost:8503

# Set environment variables for build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_AI_CHAT_URL=$REACT_APP_AI_CHAT_URL
ENV REACT_APP_DOCUMENT_ANALYSIS_URL=$REACT_APP_DOCUMENT_ANALYSIS_URL
ENV REACT_APP_WEB_SEARCH_URL=$REACT_APP_WEB_SEARCH_URL

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
