const express = require("express");
const router = express.Router();
const { getGFS } = require("../config/gfs");

// GET image by filename
router.get("/:filename", async (req, res) => {
  const gfs = getGFS();
  if (!gfs) {
    return res.status(500).json({ error: "GridFS not initialized" });
  }

  try {
    // Try to get from GridFS
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (file) {
      const readStream = gfs.createReadStream(file.filename);
      return readStream.pipe(res);
    }

    // If not in GridFS, try /uploads
    const filePath = path.join(__dirname, "..", "uploads", req.params.filename);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }

    res.status(404).json({ error: "File not found" });
  } catch (err) {
    res.status(500).json({ error: "Error retrieving file" });
  }
});

module.exports = router;