const Prescription = require('../models/Prescription');

exports.uploadPrescription = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const imagePath = req.file ? req.file.path : null;

    const newPrescription = new Prescription({ ...data, imagePath });
    const saved = await newPrescription.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const data = await Prescription.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
