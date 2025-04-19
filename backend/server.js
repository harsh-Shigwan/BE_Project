const express = require("express");

const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const vitalDataRoutes = require("./routes/vitalData");
const recommendationRoutes = require("./routes/recommendation");
const fileRoutes = require("./routes/fileRoutes");
require("dotenv").config();
const dietplan = require("./routes/dietPlan");
const exerciseRoutes = require("./routes/exercisePlan");
const pdfRoute = require("./routes/pdfRoutes");
const app = express();
const PORT = process.env.PORT || 1000;
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const OCRRoute = require("./routes/OCRRoutes");

app.use(cors());
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.json({ message: "Backend running on Vercel!" });
});
app.use("/api/vital", vitalDataRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/dietplan", dietplan);
app.use("/api/files", fileRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/vitals", vitalDataRoutes);
app.use("/api/pdf", pdfRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve images
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/ocr", OCRRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
