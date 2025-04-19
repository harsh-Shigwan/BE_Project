const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/prescriptionController');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('image'), controller.uploadPrescription);
router.get('/', controller.getPrescriptions);

module.exports = router;
