https://github.com/JoshRoberts136/IMY-220
# IMY-220 Project - ApexCoding

Version control website for collaborative coding.

## Prerequisites
- Docker Desktop installed
- MongoDB Atlas account (or local MongoDB)

## Environment Variables
Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=production
```

## Docker Commands

### Build and Run
```bash
docker-compose up --build
```

### Run (after building)
```bash
docker-compose up
```

### Stop
```bash
docker-compose down
```

Or press `Ctrl+C` and then run:
```bash
docker-compose down
```

### Access the Application
Once running, open your browser to:
```
http://localhost:3000
```

## Development (Without Docker)

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

This runs both the frontend (webpack-dev-server) and backend (Express) concurrently.

### Build for Production
```bash
npm run build
npm start
```

## Project Structure
```
IMY_220_Project/
├── backend/           # Express API and server
│   ├── config/       # Database configuration
│   ├── middleware/   # Auth middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
├── frontend/         # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── utils/       # Utilities (API service)
│       └── styles.css   # Global styles
├── public/           # Built frontend files
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── webpack.config.js # Webpack configuration
```

## Features
- User authentication (login/signup)
- Project creation and management
- File check-in/check-out system
- Friend connections
- Activity feeds (local and global)
- Project collaboration
- Search functionality

## Technologies
- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **Bundler:** Webpack
- **Containerization:** Docker

## Notes
- Make sure MongoDB URI is correctly set in `.env`
- The application runs on port 3000 by default
- Docker builds the frontend automatically during image creation
