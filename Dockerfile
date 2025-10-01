# Use Node.js 18 as base image
FROM node:18

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

# Expose ports for frontend (3000) and backend 
EXPOSE 3000 3000

# Run the development script
CMD ["npm", "run", "dev"]
