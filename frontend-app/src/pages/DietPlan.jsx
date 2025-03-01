import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaDownload, FaArrowLeft } from "react-icons/fa";
import baseURL from "../assets/API_URL";
const dietTypes = ["normal", "vegetarian", "vegan", "gluten-free", "diabetic-friendly"];

const DietPlan = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [dietType, setDietType] = useState("normal");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const planRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchDietPlan(dietType);
    }
  }, [dietType, userId]);

  const fetchDietPlan = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}/api/dietplan/${type}/${userId}`);
      setRecommendation(response.data.recommendation);
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([recommendation], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "diet_plan.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Personalized Diet Plan</h1>
      <div className="flex justify-center gap-4 mb-6">
        {dietTypes.map((type) => (
          <button
            key={type}
            onClick={() => setDietType(type)}
            className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
              dietType === type ? "bg-blue-600" : "bg-gray-500 hover:bg-blue-500"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {loading && <p className="text-lg font-semibold">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {recommendation && (
        <div className="mt-6 p-4 border rounded-md shadow-md text-left max-w-2xl mx-auto" ref={planRef}>
          <h2 className="text-xl font-bold mb-2">Diet Plan:</h2>
          <p>{recommendation}</p>
        </div>
      )}
      {recommendation && (
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600"
            onClick={handlePrint}
          >
            <FaPrint /> Print
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
            onClick={handleDownload}
          >
            <FaDownload /> Download
          </button>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
