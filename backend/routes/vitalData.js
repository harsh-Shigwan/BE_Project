const express = require('express');
const VitalData = require('../models/VitalData');
const router = express.Router();

// Fetch all vital data
router.get('/', async (req, res) => {
  try {
    const data = await VitalData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new vital data
router.post('/', async (req, res) => {
  const {
    Name,
    Age,
    Gender,
    Vitals // Vitals should be an object from the frontend
    // Example:
    // Vitals: {
    //   Hemoglobin: "13.5 g/dL",
    //   RBC_Count: "4.5 million/cu.mm",
    //   Platelet_Count: "150,000/µL",
    //   ESR: "20 mm/hr",
    //   HbA1c: "5.6%"
    // }
  } = req.body;

  const newData = new VitalData({ Name, Age, Gender, Vitals });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch vital data for a specific userId
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await VitalData.findOne({ userId: userId });

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
