const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vitalDataSchema = new mongoose.Schema({
  userId: { type: Number }, // Auto-incremented
  Name: { type: String, required: true },      
  Age: { type: Number, required: true },       
  Gender: { type: String, enum: ['Male', 'Female'], required: true },

  Vitals: {
    Hemoglobin: { type: String, required: false },      
    RBC_Count: { type: String, required: false },      
    Platelet_Count: { type: String, required: false }, 
    ESR: { type: String, required: false },       
    HbA1c: { type: String, required: false },        
  },
  timestamp: { type: Date, default: Date.now },
});

// Auto-increment userId field
vitalDataSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('VitalData', vitalDataSchema);
