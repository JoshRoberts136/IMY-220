const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base upload directory exists
const baseUploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Profile Image Upload Configuration
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile-images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const userId = req.params.userId || (req.user && (req.user.id || req.user._id)) || 'user';
    cb(null, `user_${userId}_${uniqueSuffix}${ext}`);
  }
});

const profileImageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: profileImageFilter
});

// Project Files Upload Configuration
const projectFilesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectId = req.params.id || req.body.projectId || 'temp';
    const projectDir = path.join(__dirname, '../uploads/project-files', projectId);
    
    try {
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      cb(null, projectDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}_${sanitizedName}`);
  }
});

const projectFilesFilter = (req, file, cb) => {
  // Allow all file types for projects
  cb(null, true);
};

const uploadProjectFiles = multer({
  storage: projectFilesStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: projectFilesFilter
});

module.exports = {
  uploadProfileImage,
  uploadProjectFiles
};
