const Tesseract = require('tesseract.js');
const axios = require('axios');

const extractDataFromImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    // OCR text extraction
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');

    const prompt = `
Extract the following medical data from the provided report text. Return the output in **strictly this JSON format**:

{
  "patient_id": null,
  "patient_name": "",
  "gender": "",
  "age": null,
  "doctor_name": "",
  "visit_date": "",
  "chief_complaints": [],
  "diagnosis": [],
  "prescription": [
    {
      "medicine_name": "",
      "dosage": "",
      "duration": "",
      "total": ""
    }
  ],
  "advice": [],
  "follow_up": ""
}

Report text:
"""
${text}
"""
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const geminiText = response.data.candidates[0]?.content?.parts[0]?.text || "{}";
    const cleaned = geminiText.replace(/^```json\s*|\s*```$/g, '').trim();
    const json = JSON.parse(cleaned);

    res.status(200).json({ success: true, data: json });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
};

module.exports = { extractDataFromImage };
