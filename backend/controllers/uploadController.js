const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gadgetzone-products",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    return res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { uploadImage };