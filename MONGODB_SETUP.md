# MongoDB Setup Guide

Your project has been successfully configured to use MongoDB! Here's what has been set up:

## 🚀 What's New

### Dependencies Added
- **mongoose**: MongoDB object modeling for Node.js
- **dotenv**: Environment variable management

### New Files Created
- `backend/config/database.js` - MongoDB connection configuration
- `backend/models/User.js` - User data model
- `backend/models/Post.js` - Post data model with comments and likes
- `backend/models/index.js` - Model exports
- `backend/routes/api.js` - API endpoints for database operations
- `backend/utils/seedDatabase.js` - Sample data seeding utility
- `.env` - Environment configuration (updated)

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install and Start MongoDB

**Option A: Local MongoDB Installation**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS (with Homebrew)
  brew services start mongodb/brew/mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://cloud.mongodb.com
- Create a free cluster
- Update the `MONGODB_URI` in your `.env` file with your connection string

### 3. Seed Sample Data (Optional)
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

## 📊 API Endpoints

Your server now includes these MongoDB-powered endpoints:

### Users
- `GET /api/users` - Get all active users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Posts
- `GET /api/posts` - Get all published posts (with pagination)
- `POST /api/posts` - Create new post

### Statistics
- `GET /api/stats` - Get database statistics

### Health Check
- `GET /api/health` - Server health status

## 📝 Example API Usage

### Create a User
```javascript
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'newuser',
    email: 'user@example.com',
    password: 'securepassword',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'A new user'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Create a Post
```javascript
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My First Post',
    content: 'This is the content of my first post!',
    author: 'USER_ID_HERE', // Replace with actual user ID
    tags: ['first-post', 'hello-world'],
    category: 'general'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Get All Posts
```javascript
fetch('/api/posts?page=1&limit=10')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🏗️ Database Schema

### User Schema
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required) *Note: Should be hashed in production*
- `profile` (Object)
  - `firstName` (String)
  - `lastName` (String)
  - `bio` (String)
  - `avatar` (String)
- `isActive` (Boolean, default: true)
- `lastLogin` (Date)
- `createdAt` & `updatedAt` (Timestamps)

### Post Schema
- `title` (String, required)
- `content` (String, required)
- `author` (ObjectId, ref: 'User')
- `tags` (Array of Strings)
- `category` (String, default: 'general')
- `status` (Enum: 'draft', 'published', 'archived')
- `likes` (Array of Objects with user and timestamp)
- `comments` (Array of Objects with user, content, and timestamp)
- `viewCount` (Number, default: 0)
- `featured` (Boolean, default: false)
- `createdAt` & `updatedAt` (Timestamps)

## 🔒 Security Notes

**Important**: This setup is for development. For production, you should:

1. **Hash passwords** - Install `bcryptjs` and hash passwords before storing
2. **Add authentication** - Implement JWT tokens or sessions
3. **Validate input** - Add proper validation middleware
4. **Rate limiting** - Implement rate limiting for API endpoints
5. **Environment security** - Use secure, randomly generated secrets
6. **Database security** - Configure MongoDB with authentication

## 🛠️ Development Tips

1. **MongoDB Compass**: Download MongoDB Compass for a GUI to view your data
2. **Mongoose DevTools**: Helpful for debugging queries
3. **Error Handling**: Check the console for detailed error messages
4. **Indexing**: The schemas include indexes for better query performance

## 📚 Next Steps

1. Install dependencies: `npm install`
2. Start MongoDB (locally or use Atlas)
3. Seed sample data: `npm run seed`
4. Start your server: `npm start`
5. Test the API endpoints using a tool like Postman or your frontend

Your MongoDB integration is ready to use! 🎉