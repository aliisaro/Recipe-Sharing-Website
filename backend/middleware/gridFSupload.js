// middleware/gridfsUpload.js
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const { MONGO_URI } = require("../utils/config");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads",
    };
  }
});

const uploadGridFS = multer({ storage });

// Add a property so controller knows storage type
const setStorageType = (req, res, next) => {
  if (req.file) {
    req.file.storageType = "gridfs";
  }
  next();
};

module.exports = [uploadGridFS.single("image"), setStorageType];

