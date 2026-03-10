# ---------- Base Builder Image ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on package.json + lock file
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build Next.js in standalone mode
RUN npm run build

# ---------- Production Image ----------
FROM node:20-alpine AS production

WORKDIR /app

# Add non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy only the built output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Switch user
USER nextjs

# Expose Next.js port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Start Next.js server
CMD ["node", "server.js"]