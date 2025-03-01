const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { fromPath } = require("pdf2pic");

// Extract text from a file
exports.extractText = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = "";

    try {
        if (fileType === "application/pdf") {
            // Extract text from PDF
            const pdfBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(pdfBuffer);
            extractedText = data.text.trim();

            // If no text found, use OCR
            if (!extractedText) {
                const converter = fromPath(filePath, { density: 300, savePath: "uploads", format: "png" });
                const image = await converter(1, true);
                const { data: ocrData } = await Tesseract.recognize(image.path);
                extractedText = ocrData.text;
            }
        } else {
            // Extract text from image using OCR
            const { data: ocrData } = await Tesseract.recognize(filePath);
            extractedText = ocrData.text;
        }

        fs.unlinkSync(filePath); // Cleanup uploaded file
        res.json({ text: extractedText });

    } catch (error) {
        console.error("Error extracting text:", error);
        res.status(500).json({ error: "Failed to extract text" });
    }
};
