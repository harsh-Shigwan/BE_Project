const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vitalDataSchema = new mongoose.Schema({
    userId: { type: Number }, // Auto-incremented
    heartRate: { type: Number, required: false },  
    bloodPressure: { type: String, required: false },  
    temperature: { type: Number, required: false },  
    oxygenLevel: { type: Number, required: false },  
    timestamp: { type: Date, default: Date.now },
  });

// Auto-increment userId field
vitalDataSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('VitalData', vitalDataSchema);
