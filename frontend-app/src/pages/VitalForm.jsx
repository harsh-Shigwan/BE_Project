import React, { useEffect, useState } from "react";
import axios from "axios";
import Vital from "./Vital";
import { useNavigate } from "react-router-dom";
const VitalForm = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    oxygenLevel: "",
  });
 const navigate = useNavigate();
 const handle = () => {
  navigate('/recommendation');
 }
 const handle1 = () => {
  navigate('/fileupload');
 }
  // Fetch Vital Data
  useEffect(() => {
    axios
      .get(`${baseURL}/api/vital`)
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle Form Input Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/api/vital`, form)
      .then((res) => {
        alert("Vital data added successfully! ✅");
        setData([...data, res.data]); // Update UI with new data
        setForm({ heartRate: "", bloodPressure: "", temperature: "", oxygenLevel: "" }); // Reset form
      })
      .catch((error) => console.error("Error adding vital data:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vital Data</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  mb-10 " onClick={handle}>
      Add Data
    </button>

    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-5  mb-10 " onClick={handle1}>
     Upload Data
  </button>
      {/* Vital Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-100">
        <h2 className="text-xl font-semibold mb-3">Add New Vital Data</h2>

        <label className="block mb-2">
          💓 Heart Rate:
          <input
            type="number"
            name="heartRate"
            value={form.heartRate}
            onChange={handleChange}
            placeholder="Normal: 60-100 BPM"
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          🩸 Blood Pressure:
          <input
            type="text"
            name="bloodPressure"
            value={form.bloodPressure}
            onChange={handleChange}
            placeholder="Normal: 90/60 - 120/80 mmHg"
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          🌡 Temperature (°C):
          <input
            type="number"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            placeholder="Normal: 36.1 - 37.2°C"
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          🫁 Oxygen Level (%):
          <input
            type="number"
            name="oxygenLevel"
            value={form.oxygenLevel}
            onChange={handleChange}
            placeholder="Normal: 95-100%"
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>

      {/* Display Vital Data */}
      
     
    
    </div>
  );
};

export default VitalForm;
