# Docker Setup Guide - IMY 220 Project

## Quick Start

### Option 1: Using the Test Script (Recommended)
**Windows:**
```bash
docker-test.bat
```

**Mac/Linux:**
```bash
chmod +x docker-test.sh
./docker-test.sh
```

### Option 2: Manual Commands

**Build and start:**
```bash
docker-compose up --build
```

**Stop (when done):**
```bash
Ctrl+C
docker-compose down
```

## What the Docker Setup Does

1. **Builds your frontend** - Runs `npm run build` which creates `public/bundle.js`
2. **Starts your backend** - Runs Express server on port 3000
3. **Serves your app** - Backend serves the built frontend files from `/public`

## Port Configuration
- **Application:** http://localhost:3000
- The backend and frontend both run on port 3000 (backend serves the built frontend)

## Environment Variables
Make sure your `.env` file contains:
```env
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=production
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Stop any running Docker containers
docker-compose down

# Check what's using port 3000
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000
```

### Build Fails
```bash
# Clean everything and rebuild
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up
```

### Can't Connect to MongoDB
- Verify your `MONGODB_URI` in `.env` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Make sure your IP is whitelisted in MongoDB Atlas

### View Container Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View only backend logs
docker logs imy220-container
```

### Enter the Container
```bash
docker exec -it imy220-container sh
```

## File Structure in Docker

```
/app
├── backend/          # Your Express backend
├── frontend/         # Your React source
├── public/           # Built frontend (bundle.js)
│   ├── index.html
│   └── bundle.js     # Webpack creates this
├── node_modules/     # Dependencies
└── package.json
```

## Production vs Development

**Development (local):**
```bash
npm run dev
```
- Webpack dev server on port 3000
- Backend on port 3000
- Hot reload enabled
- Concurrently runs both

**Production (Docker):**
```bash
docker-compose up --build
```
- Frontend built to static files
- Backend serves static files
- Single port (3000)
- Production optimized

## Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Build and start |
| `docker-compose up` | Start (no build) |
| `docker-compose down` | Stop containers |
| `docker-compose logs -f` | View logs |
| `docker-compose ps` | List running containers |
| `docker system prune -f` | Clean up Docker |

## For Submission

Make sure you submit:
1. ✅ `Dockerfile`
2. ✅ `docker-compose.yml`
3. ✅ `.dockerignore`
4. ✅ `README.md` (with Docker instructions)
5. ✅ `.env` file with working MongoDB URI

## Testing Before Submission

1. **Clean build test:**
   ```bash
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

2. **Access http://localhost:3000**

3. **Test functionality:**
   - Login works
   - Create project works
   - All features functional

4. **Check logs for errors:**
   ```bash
   docker-compose logs
   ```

If everything works, you're ready to submit! 🎉
