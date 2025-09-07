# Multi-stage build for ISP Management System with daloRADIUS
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    mysql-client \
    freeradius \
    freeradius-mysql \
    freeradius-utils \
    php81 \
    php81-fpm \
    php81-mysql \
    php81-curl \
    php81-gd \
    php81-mbstring \
    php81-xml \
    php81-zip \
    supervisor \
    curl \
    wget \
    nano

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Install production dependencies
RUN npm install --only=production

# Copy server file
COPY --chown=nextjs:nodejs server.js ./

# Create necessary directories
RUN mkdir -p /var/log/nginx /var/lib/nginx /var/log/freeradius /var/log/supervisor

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/freeradius/ /etc/freeradius/3.0/
COPY docker/php.ini /etc/php81/php.ini

# Create environment file
RUN echo "VITE_RADIUS_API_URL=http://localhost:3001/api/radius" > .env.production

# Expose ports
EXPOSE 80 443 1812/udp 1813/udp 3001

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
