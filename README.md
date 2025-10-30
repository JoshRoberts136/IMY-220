# ApexCoding

https://github.com/JoshRoberts136/IMY-220

Collaborative version control platform for developers.

## Running with Docker

```bash
docker-compose up --build
```

Go to `http://localhost:3000`

Stop it with `Ctrl+C` then:
```bash
docker-compose down
```

## Running locally

```bash
npm install
npm run dev
```

For production:
```bash
npm run build
npm run dev
```

## What's in here

```
backend/
  config/      - database stuff
  middleware/  - auth
  routes/      - API endpoints
  server.js    - main server
  uploads/     - user files

frontend/src/
  components/  - React components
  pages/       - page components
  utils/       - API service
  styles.css   - global styles

public/        - built files
```

## Features

- Login/signup
- Create and manage projects
- Check-in/check-out system
- Add friends
- Activity feeds
- Project chat
- File uploads
- Search

## Stack

React + Express + MongoDB + JWT + Docker
