#!/bin/bash

echo "================================"
echo "IMY 220 Docker Build & Test"
echo "================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Clean up any existing containers
echo "🧹 Cleaning up old containers..."
docker-compose down 2>/dev/null

# Build the Docker image
echo ""
echo "🔨 Building Docker image..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Start the container
echo ""
echo "🚀 Starting container..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    echo ""
    echo "================================"
    echo "🎉 Application is running!"
    echo "================================"
    echo ""
    echo "📍 URL: http://localhost:3000"
    echo ""
    echo "To view logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "To stop:"
    echo "  docker-compose down"
    echo ""
else
    echo "❌ Failed to start container!"
    exit 1
fi
