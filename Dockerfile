# Use Node.js base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app/server

# Copy package files and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy all backend source code
COPY server/. .

# Expose port (matches your index.js)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
