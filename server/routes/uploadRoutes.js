const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload_stream(
      { folder: "worker-completions" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }
        res.json({ url: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
