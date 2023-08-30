const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage to store the image buffer

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
