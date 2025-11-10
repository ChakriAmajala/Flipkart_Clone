# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from server folder
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy all source code from server folder
COPY server/. .

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
