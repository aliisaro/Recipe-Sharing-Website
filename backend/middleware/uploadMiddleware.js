// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Base storage for uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // consistent path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Default upload config
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter,
});

// Function to create custom configs
const createUpload = (options = {}) => {
  return multer({
    storage: options.storage || storage,
    limits: options.limits || { fileSize: 1024 * 1024 * 5 },
    fileFilter: options.fileFilter || fileFilter,
  });
};

module.exports = { upload, createUpload, storage };
