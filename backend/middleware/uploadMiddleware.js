const multer = require("multer");
const path = require("path");

// Define storage for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    // Rename the file with current timestamp to avoid duplicates
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter function to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload: upload,
  storage: storage,
};
