# -------------------------------
# Stage 1 — Build React frontend
# -------------------------------
FROM node:23-alpine AS build
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# -------------------------------
# Stage 2 — Build backend + copy frontend
# -------------------------------
FROM node:23-alpine
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm install

# Copy built frontend into backend public folder
COPY --from=build /app/client/build ./public

EXPOSE 4000
CMD ["npm", "start"]
