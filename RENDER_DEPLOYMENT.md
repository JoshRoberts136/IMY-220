# Render Deployment Guide for IMY 220 Project

## Problem Summary
The deployment was failing because:
1. Both webpack-dev-server and the backend server were trying to use port 3000
2. Webpack-dev-server should NOT run in production
3. The `start` command was running the wrong script

## Solution Implemented

### 1. Updated package.json Scripts
```json
{
  "scripts": {
    "start": "npm run build && node backend/server.js",  // Production: Build first, then serve
    "dev": "concurrently \"npm run serve\" \"npm run server\"",  // Local dev: Run both servers
    "server": "node backend/server.js",  // Just run backend
    "serve": "webpack serve --mode development"  // Just run webpack-dev-server
  }
}
```

### 2. Updated webpack.config.js
- Changed webpack-dev-server port from 3000 to 8080
- Added proxy configuration to forward API requests to backend

## Render Configuration

### Step 1: Create a New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Build & Deploy Settings

**Basic Settings:**
- **Name:** `apexcoding` (or your preferred name)
- **Region:** Choose closest to you
- **Branch:** `main` (or your deployment branch)
- **Root Directory:** Leave blank (or set to project directory if in monorepo)
- **Runtime:** `Node`

**Build & Deploy Settings:**
- **Build Command:** 
  ```bash
  npm install && npm run build
  ```
  
- **Start Command:** 
  ```bash
  npm start
  ```

### Step 3: Environment Variables
Add these in Render's Environment section:

**Required:**
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
```

**Optional (if using):**
```
REACT_APP_API_URL=https://apexcoding.onrender.com/api
```

### Step 4: Advanced Settings (Optional)
- **Health Check Path:** `/api/health`
- **Auto-Deploy:** Enable (deploys automatically on git push)

## Local Development

### First Time Setup
```bash
npm install
```

### Development Mode (Runs both servers)
```bash
npm run dev
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api

### Production Build (Test locally)
```bash
npm run build
npm run server
```
- Application: http://localhost:3000

## Troubleshooting

### Error: EADDRINUSE
**Cause:** Another process is using port 3000 or 8080

**Solution:**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: Failed to fetch / ERR_CONNECTION_REFUSED
**Cause:** Frontend trying to connect to wrong API URL

**Solutions:**
1. Check that `REACT_APP_API_URL` environment variable is set correctly on Render
2. Make sure your API endpoints use relative paths: `/api/...` not `http://localhost:3000/api/...`
3. Verify CORS is configured correctly in backend

### Deployment Still Failing?

**Check Render Logs:**
1. Go to your service on Render
2. Click "Logs" tab
3. Look for specific error messages

**Common Issues:**
- MongoDB connection string not set
- Missing environment variables
- Build command failing (check node version compatibility)

### MongoDB Connection Issues
Make sure your MongoDB Atlas:
1. Allows connections from anywhere (IP: 0.0.0.0/0) in Network Access
2. Has a database user created
3. Connection string includes database name

## File Structure
```
IMY_220_Project/
├── backend/
│   ├── server.js           # Express server (runs on port 3000)
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   └── src/
│       └── index.js        # React app entry
├── public/                 # Built files served by Express
│   ├── index.html
│   └── bundle.js
├── package.json
├── webpack.config.js
└── .env                    # Local environment variables (don't commit!)
```

## Deployment Checklist

Before deploying, ensure:
- [ ] `.env` file is NOT committed to Git
- [ ] MongoDB Atlas network access allows 0.0.0.0/0
- [ ] All environment variables are set in Render
- [ ] `package.json` has correct Node version (if specified)
- [ ] All dependencies are in `dependencies` not `devDependencies` (for production packages)
- [ ] Build completes successfully locally with `npm run build`

## Support

If you're still having issues:
1. Check Render logs for specific errors
2. Test the build locally: `npm run build && npm start`
3. Verify MongoDB connection in Render logs
4. Check that Render assigned the correct port (should auto-detect)

## API Endpoints Reference

Once deployed, your API will be available at:
```
https://apexcoding.onrender.com/api/
```

Test health endpoint:
```
https://apexcoding.onrender.com/api/health
```

## Notes

- **Free Tier Limitation:** Render free tier services spin down after 15 minutes of inactivity
- **First Request:** May take 30-60 seconds to wake up
- **Build Time:** Usually 2-5 minutes
- **Logs:** Available for 7 days on free tier
