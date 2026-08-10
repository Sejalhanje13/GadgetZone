const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");

router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR:", err);
      return res.status(500).json({
        message: err.message,
        error: err,
      });
    }

    next();
  });
}, uploadImage);

module.exports = router;