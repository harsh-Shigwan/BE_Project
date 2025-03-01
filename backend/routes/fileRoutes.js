const express = require("express");
const multer = require("multer");
const { extractText } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route to handle file upload and text extraction
router.post("/upload", upload.single("file"), extractText);

module.exports = router;
