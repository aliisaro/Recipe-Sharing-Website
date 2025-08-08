// middleware/gridfsUpload.js
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const { MONGO_URI } = require("./utils/config");

// Create storage engine
const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generate a unique filename
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        resolve({
          filename: filename,
          bucketName: "uploads", // collection will be uploads.files & uploads.chunks
        });
      });
    });
  },
});

const uploadGridFS = multer({ storage });

module.exports = uploadGridFS;
