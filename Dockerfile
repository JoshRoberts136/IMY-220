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

# Expose port
EXPOSE 3000

# Run production server
CMD ["npm", "start"]
