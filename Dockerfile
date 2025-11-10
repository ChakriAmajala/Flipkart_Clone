# Use lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for layer caching)
COPY server/package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the application files
COPY server/. .

# Copy .env if needed (only if you use it inside Docker)
# COPY server/.env .env

# Expose the same port your app uses
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
