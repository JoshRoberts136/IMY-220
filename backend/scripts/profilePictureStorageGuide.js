/**
 * HOW TO STORE PROFILE PICTURES IN MONGODB
 * 
 * There are 2 main approaches:
 * 1. Store the image file path/URL in MongoDB (RECOMMENDED)
 * 2. Store the actual image data as Base64 in MongoDB (NOT recommended for large files)
 * 
 * We'll use approach #1 - store the file path
 */

// ============================================
// APPROACH 1: Store File Path (RECOMMENDED)
// ============================================

/**
 * STEP 1: Update your User schema to include avatar path
 * Location: backend/models/userModel.js (if you have one) or in your routes
 */

const userSchema = {
  id: String,
  username: String,
  email: String,
  password: String,
  profile: {
    avatar: String,  // Store path like: '/uploads/profile-images/user_123_timestamp.jpg'
    title: String,
    bio: String,
    location: String
  },
  createdAt: Date,
  updatedAt: Date
};

/**
 * STEP 2: Create upload endpoint in backend
 * Location: backend/routes/users.js or backend/routes/upload.js
 */

// Install multer for file uploads:
// npm install multer

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-images';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.id; // From auth middleware
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}_${timestamp}${ext}`);
  }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Upload route
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/profile-images/${req.file.filename}`;

    // Update user in MongoDB
    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { 
        $set: { 
          'profile.avatar': avatarPath,
          updatedAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarPath: avatarPath
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

/**
 * STEP 3: Serve static files from uploads folder
 * Location: backend/server.js or backend/index.js
 */

const express = require('express');
const app = express();

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * STEP 4: Frontend - Update ProfileImageUpload component
 * Location: frontend/src/components/ProfileImageUpload.js
 * (You already have this component, just make sure it calls the correct API)
 */

const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiService.request('/users/upload-avatar', {
    method: 'POST',
    body: formData,
    headers: {} // Let browser set Content-Type
  });

  if (response.success) {
    // Update local state with new avatar path
    onUploadSuccess(response.avatarPath);
  }
};

/**
 * STEP 5: Display the avatar
 * The avatar path is stored as '/uploads/profile-images/user_123_timestamp.jpg'
 * Display it like: <img src={user.profile.avatar} alt="avatar" />
 * 
 * Your backend serves it from: http://localhost:5000/uploads/profile-images/...
 */

// ============================================
// FOLDER STRUCTURE
// ============================================

/*
your-project/
├── backend/
│   ├── uploads/              ← Created automatically
│   │   └── profile-images/   ← Profile pictures stored here
│   │       ├── user_001_1234567890.jpg
│   │       ├── user_002_1234567891.png
│   │       └── ...
│   ├── routes/
│   │   └── users.js         ← Upload endpoint here
│   └── server.js            ← Serve static files here
└── frontend/
    └── src/
        └── components/
            └── ProfileImageUpload.js
*/

// ============================================
// IMPORTANT NOTES
// ============================================

/**
 * 1. MongoDB stores the FILE PATH, not the actual image
 * 2. Actual images are stored in the 'uploads/profile-images' folder
 * 3. Backend serves these files as static content
 * 4. Frontend displays images using the stored path
 * 5. Max file size: 5MB (configurable in multer)
 * 6. Allowed formats: JPEG, JPG, PNG, GIF, WEBP
 * 7. Old avatars are NOT automatically deleted (you may want to add cleanup logic)
 */

// ============================================
// COMPLETE EXAMPLE FOR YOUR PROJECT
// ============================================

// Add this to: backend/routes/users.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'profile-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/profile-images/${req.file.filename}`;

    await mongoose.connection.db.collection('Users').updateOne(
      { id: userId },
      { $set: { 'profile.avatar': avatarPath, updatedAt: new Date() }}
    );

    res.json({ success: true, avatarPath: avatarPath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

module.exports = router;
