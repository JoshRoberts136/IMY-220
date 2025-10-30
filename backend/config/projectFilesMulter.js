const multer = require('multer');
const path = require('path');
const fs = require('fs');

const projectFilesUploadDir = path.join(__dirname, '../uploads/project-files');
if (!fs.existsSync(projectFilesUploadDir)) {
  fs.mkdirSync(projectFilesUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectId = req.params.id || req.body.projectId || 'temp';
    const projectDir = path.join(projectFilesUploadDir, projectId);
    
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

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const uploadProjectFiles = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: fileFilter
});

module.exports = uploadProjectFiles;
