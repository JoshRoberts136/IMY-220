@echo off
echo ================================
echo IMY 220 Docker Build and Test
echo ================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo Docker is running
echo.

REM Clean up any existing containers
echo Cleaning up old containers...
docker-compose down 2>nul

REM Build the Docker image
echo.
echo Building Docker image...
docker-compose build

if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo Build successful!

REM Start the container
echo.
echo Starting container...
docker-compose up -d

if errorlevel 1 (
    echo ERROR: Failed to start container!
    pause
    exit /b 1
)

echo.
echo ================================
echo Application is running!
echo ================================
echo.
echo URL: http://localhost:3000
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop:
echo   docker-compose down
echo.
pause
