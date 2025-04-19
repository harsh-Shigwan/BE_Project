const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Google Gemini API Key
const GEMINI_API_KEY = "AIzaSyDCsJ9X7plCt0IMqFxY4cMvfpN-1B8c6sU";
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch user vital data
    const vitalResponse = await axios.get(`http://localhost:3300/api/vital/${userId}`);
    console.log("Fetched Data:", vitalResponse.data);
    const data = vitalResponse.data;

    const prompt = `
      Based on the following vital signs:
      - Heart Rate:  33 bpm
      - Blood Pressure: 120/80
      - Temperature: 40°C
      - Oxygen Level: 90%

      Recommend a detailed diet plan and exercise routine.
    `;

    // Call Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract response from Gemini API
    const recommendation = geminiResponse.data.candidates[0]?.content.parts[0]?.text || "No response from Gemini API";

    res.json({ recommendation });
    console.log("Recommendation:", recommendation);

  } catch (error) {
    console.error("Gemini API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Error communicating with Gemini API", error: error.message });
  }
});

module.exports = router;
