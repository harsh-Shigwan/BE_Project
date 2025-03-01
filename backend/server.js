const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const vitalDataRoutes = require('./routes/vitalData');
const recommendationRoutes = require('./routes/recommendation');
const fileRoutes = require("./routes/fileRoutes");
require('dotenv').config();
const dietplan = require('./routes/dietPlan');
const exerciseRoutes = require('./routes/exercisePlan');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/vital', vitalDataRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use("/api/dietplan", dietplan);
app.use("/api/files", fileRoutes);
app.use("/api/exercise" , exerciseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
