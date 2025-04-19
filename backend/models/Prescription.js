const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient_id: Number,
  patient_name: String,
  gender: String,
  age: Number,
  doctor_name: String,
  visit_date: String,
  chief_complaints: [String],
  diagnosis: [String],
  prescription: [
    {
      medicine_name: String,
      dosage: String,
      duration: String,
      total: String
    }
  ],
  advice: [String],
  follow_up: String,
  imagePath: String
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
