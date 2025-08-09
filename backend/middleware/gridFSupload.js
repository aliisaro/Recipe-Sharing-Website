const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");

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

const uploadSingle = uploadGridFS.single("image");

// Add a property so controller knows storage type
const setStorageType = (req, res, next) => {
  if (req.file) {
    req.file.storageType = "gridfs";
  }
  next();
};

module.exports = {
  uploadSingle,
  setStorageType
};
