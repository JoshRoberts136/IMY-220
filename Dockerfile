# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports for frontend (3000) and backend 
EXPOSE 3000 3000

# Run the development script
CMD ["npm", "run", "dev"]