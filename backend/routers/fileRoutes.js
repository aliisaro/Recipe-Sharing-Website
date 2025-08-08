const express = require("express");
const router = express.Router();
const { getGFS } = require("../config/gfs");

router.get("/:filename", async (req, res) => {
  try {
    const gfs = getGFS();
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file) return res.status(404).json({ error: "File not found" });

    if (file.contentType.startsWith("image/")) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({ error: "Not an image" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
