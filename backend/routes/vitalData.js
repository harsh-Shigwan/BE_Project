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
  const { userId, heartRate, bloodPressure, temperature, oxygenLevel } = req.body;
  const newData = new VitalData({ userId, heartRate, bloodPressure, temperature, oxygenLevel });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch vital data for a specific user
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