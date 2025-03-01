const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// Google Gemini API Key
const GEMINI_API_KEY = "AIzaSyDTgxtvi0qqERS5YU5FHR3eI0r_K7DJ6bI";

// Function to fetch exercise plan based on type and duration
const getExercisePlan = async (userId, exerciseType, duration) => {
  try {
    // Fetch user vital data
    const vitalResponse = await axios.get(`http://localhost:5000/api/vital/${userId}`);
    console.log("Fetched Data:", vitalResponse.data);
    const data = vitalResponse.data;

    // Enhanced prompt with exercise type and duration
    const prompt = `
      A user has the following vital health data:

      - **Heart Rate**: ${data.heartRate} bpm
      - **Blood Pressure**: ${data.bloodPressure}
      - **Temperature**: ${data.temperature}°C
      - **Oxygen Level**: ${data.oxygenLevel}%

      Based on these vitals, Generate a personalized and detailed workout plan suitable for a healthy lifestyle for Indian ${exerciseType} people with a workout duration of ${duration}.
    
      Ensure the output is structured, interactive, and designed for an engaging user experience! Use emojis to enhance readability.
      
### **Workout Plan Breakdown:**  
#### **1. Warm-Up (5-10 mins)**  
   - Provide **2-3 dynamic warm-up exercises**.  
   - Explain **how each warm-up benefits the heart, blood pressure, and muscles**.  

#### **2. Main Workout (${duration})**  
   - List **specific exercises with reps and sets**.  
   - Provide a **detailed explanation** on form, intensity, and modifications.  
   - Suggest **alternative options** for different fitness levels.  

#### **3. Cool Down (5-10 mins)**  
   - Include **stretching and relaxation exercises**.  
   - Explain **how these exercises aid muscle recovery and flexibility**.  

### **Additional Health Guidelines:**  

#### **Hydration and Nutrition**  
   - Provide **pre and post-workout nutrition tips**.  
   - Suggest **hydration strategies** for optimal performance.  

#### **Recovery and Rest**  
   - Explain **the importance of rest and sleep**.  
   - Suggest **rest days and active recovery techniques**.  

### **Motivational Tips & Lifestyle Recommendations:**  
- **Consistency and Goal Setting** for long-term success.  
- **Exercise Modifications** for injuries or health concerns.  
- **Breathing Techniques** to enhance endurance and performance.  

Ensure that the plan is **realistic, easy to follow, and optimized for overall health** based on the given vitals. The exercise plan should be **scientifically accurate, practical, and user-friendly** for patients and health-conscious individuals.
    `;

    // Call Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return geminiResponse.data.candidates[0]?.content?.parts[0]?.text || "No response from Gemini API";
  } catch (error) {
    console.error("Gemini API Error:", error.response ? error.response.data : error.message);
    throw new Error("Error communicating with Gemini API");
  }
};

// Define routes for different workout needs
const exerciseTypes = ["cardio", "strength", "flexibility", "high-intensity", "yoga"];
const durations = ["20min", "40min", "1hr"];

exerciseTypes.forEach(exercise => {
  durations.forEach(duration => {
    router.get(`/${exercise}/${duration}/:userId`, async (req, res) => {
      try {
        const userId = req.params.userId;
        const recommendation = await getExercisePlan(userId, exercise, duration);
        res.json({ recommendation });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  });
});

module.exports = router;
