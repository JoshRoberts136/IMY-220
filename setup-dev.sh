#!/bin/bash

# Development Setup Script
echo "🚀 Setting up ApexCoding development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional development dependencies if needed
echo "📦 Installing additional dev dependencies..."
npm install --save-dev concurrently nodemon

# Create .env file for development (optional)
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api
REACT_APP_API_URL=http://localhost:3000/api
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "🏃‍♂️ To start development:"
echo "  Frontend only: npm run serve"
echo "  Backend only:  npm run start"
echo "  Both together: npm run dev (after installing concurrently)"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:8080 (dev server)"
echo "  Backend:  http://localhost:3000"
echo "  API:      http://localhost:3000/api"