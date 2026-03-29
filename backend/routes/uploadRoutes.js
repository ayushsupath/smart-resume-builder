const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed!'), false);
    }
  }
});

// Wrap multer error handler so the app doesn't crash on invalid files
const uploadMiddleware = (req, res, next) => {
  upload.single('resume')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/analyze', uploadMiddleware, uploadController.uploadAndAnalyze);
router.post('/improve', uploadMiddleware, uploadController.uploadAndImprove);

module.exports = router;
