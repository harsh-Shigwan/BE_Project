const axios = require('axios');
const pdfParse = require('pdf-parse');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const cleanGeminiResponse = (text) => {
  if (!text) return null;
  
  // Remove markdown code blocks
  let cleaned = text.replace(/^```json\s*|\s*```$/g, '');
  cleaned = cleaned.replace(/^json\n/, '');
  cleaned = cleaned.trim();
  
  return cleaned;
};

const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "The PDF appears to be empty or couldn't be read"
      });
    }

    // Create Prompt for Gemini API
    const prompt = `
      Extract the following information from this medical report:
      - Patient Name
      - Age
      - Gender
      - 5 Important Vital Data (like Hemoglobin, RBC, Platelet Count, ESR, HbA1c)

      The output should be in JSON format:
      {
        "Name": "Patient Name",
        "Age": "XX",
        "Gender": "Male/Female",
        "Vitals": {
          "Hemoglobin": "X.X g/dL",
          "RBCCount": "X.XX million/cu.mm",
          "PlateletCount": "XXX,000/µL",
          "ESR": "X mm/hr",
          "HbA1c": "X.X%"
        }
      }

      Here is the extracted report text:
      ${pdfText.substring(0, 10000)} // Limit to first 10k chars to avoid huge prompts
    `;

    // Call Google Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const responseText = geminiResponse.data.candidates[0]?.content?.parts[0]?.text;
    const cleanedResponse = cleanGeminiResponse(responseText);

    if (!cleanedResponse) {
      return res.status(500).json({
        success: false,
        message: "No valid response from the AI model"
      });
    }

    // Parse the JSON response
    const parsedData = JSON.parse(cleanedResponse);

    return res.json({ 
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error("Error in PDF processing:", error);
    
    let errorMessage = "Error processing PDF";
    if (error.response?.data) {
      errorMessage += `: ${JSON.stringify(error.response.data)}`;
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    return res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

module.exports = { uploadPdf };