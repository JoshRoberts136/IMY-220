# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Build the frontend
RUN npm run build

# Expose port 3000 for the backend
EXPOSE 3000

# Start the backend server (which will serve the built frontend)
CMD ["node", "backend/server.js"]
