
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();



// Function to fetch diet plan based on type
const getDietPlan = async (userId, dietType) => {
  try {
    // Fetch user vital data
    const vitalResponse = await axios.get(`http://localhost:3300/api/vital/${userId}`);
    console.log("Fetched Data:", vitalResponse.data);
    const data = vitalResponse.data;
    console.log("Data:", data);

    // Enhanced prompt with dietary type
    const prompt = `
      A Patient ${data.Name} of age ${data.Age} and gender ${data.Gender} has the following vital health data:

      - **Hemoglobin**: ${data.Vitals.Hemoglobin} 
      - **RBC Count**: ${data.Vitals.RBC_Count} 
      - **Platelet Count**: ${data.Vitals.Platelet_Count}
      - **ESR**: ${data.Vitals.ESR}
      - **HbA1c**: ${data.Vitals.HbA1c}

      Based on these vitals, Generate a personalized and detailed healthy diet plan suitable for a healthy lifestyle for Indian ${dietType} people.
    
      Ensure the output is structured, interactive, and designed for an engaging user experience! Use emojis to enhance readability.
      
      
### **Diet Plan Breakdown:**  
#### **1. Breakfast**  
   - Provide **2-3 healthy meal options** with portion sizes (in grams).  
   - Include **calories, protein, carbohydrates, fiber, fats, vitamins & minerals**.  
   - Suggest **alternative options** based on dietary preferences (vegetarian, vegan, diabetic-friendly, etc.).  
   - Explain **how the meal benefits heart health, blood pressure, and oxygen levels**.  

#### **2. Lunch**  
   - List **balanced meal options** with portion sizes.  
   - Provide a **detailed nutritional breakdown** (calories, proteins, healthy fats, fiber, vitamins).  
   - Suggest **substitutes for different dietary needs**.  
   - Mention **how these meals support overall health**.  

#### **3. Snacks**  
   - Suggest **quick & nutritious snack ideas** that are **low in unhealthy fats and sugars**.  
   - Mention **portion sizes** and nutritional value.  
   - Provide **alternatives for different dietary needs**.  
   - Explain **how these snacks support heart, blood pressure, and energy levels**.  

#### **4. Dinner**  
   - List **light but nutritious meal options** with portion sizes.  
   - Provide **a full breakdown of macronutrients & vitamins**.  
   - Suggest **low-calorie, heart-friendly alternatives**.  
   - Explain how these meals **aid digestion, improve sleep, and regulate metabolism**.  

---

### **Additional Health Guidelines:**  

#### **Essential Fruits & Drinks**  
   - List **specific fruits & beverages** beneficial for heart health, oxygen levels, and blood pressure.  
   - Explain **why each fruit or drink is helpful**.  
   - Suggest **natural detox drinks & herbal teas** for added health benefits.  

#### **Superfoods to Include**  
   - List **key superfoods** that help regulate **heart rate, blood pressure, and oxygen levels**.  
   - Provide **ways to incorporate them** into daily meals.  

#### **Foods to Avoid**  
   - Mention **processed foods, high-sodium meals, excess sugar, and unhealthy fats** that should be limited.  
   - Explain **why these foods can be harmful based on the patient’s vitals**.  

#### **Daily Hydration Plan**  
   - Provide **an optimal hydration schedule**, including:  
     - Recommended **water intake per day**.  
     - Herbal teas or electrolyte drinks that help **maintain good health**.  
     - How **dehydration can affect vitals**.  

###*** What things must be avoid to consume***###
    - List **unhealthy eating habits**, excessive caffeine, smoking, alcohol, and stress triggers.  
    - Explain **why avoiding these can improve health**. 

### **Healthy Lifestyle Recommendations:**  
- **Best Meal Timing** based on digestion and metabolism.  
- **Exercise Suggestions** based on patient vitals (light workouts, yoga, walking, etc.).  
- **Stress Management Tips** to control heart rate and blood pressure (meditation, breathing exercises).  
- **Sleep Hygiene Tips** for better recovery and health improvement.  

---

### **Healthy Recipes:**  
Provide **3 quick and easy** home-cooked healthy recipes with:  
- **Ingredients** (common household items).  
- **Step-by-step preparation** (quick & simple).  
- **Cooking time** (under 20 minutes).  
- **Nutritional breakdown** (calories, protein, fiber, vitamins).  
- **Why this recipe is good for health** (heart-friendly, anti-inflammatory, boosts oxygen levels, etc.).  

  

Ensure that the plan is **realistic, easy to follow, and optimized for overall health** based on the given vitals. The diet plan should be **scientifically accurate, practical, and user-friendly** for patients and health-conscious individuals.

    `;

    // Call Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

// Define routes for different dietary needs
const dietTypes = ["normal","vegetarian", "vegan", "gluten-free", "diabetic-friendly"];



dietTypes.forEach(diet => {
  router.get(`/${diet}/:userId`, async (req, res) => {
    try {
      const userId = req.params.userId;
      const recommendation = await getDietPlan(userId, diet);
      res.json({ recommendation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
});

module.exports = router;

