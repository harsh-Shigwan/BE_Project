const express = require('express');
const multer = require('multer');
const { extractDataFromImage } = require('../controllers/OCRController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', upload.single('image'), extractDataFromImage);

module.exports = router;
